import time
from datetime import datetime, timedelta
from io import StringIO

import numpy as np
import pandas as pd
import requests
import yfinance as yf


analysis_cache = {}
CACHE_DURATION_SECONDS = 600


def get_cache_key(ticker, period):
    return f"{ticker.upper()}_{period}"


def get_cached_analysis(ticker, period):
    cache_key = get_cache_key(ticker, period)
    cached_item = analysis_cache.get(cache_key)

    if not cached_item:
        return None

    cache_age = time.time() - cached_item["timestamp"]

    if cache_age > CACHE_DURATION_SECONDS:
        del analysis_cache[cache_key]
        return None

    return cached_item["data"]


def save_cached_analysis(ticker, period, data):
    cache_key = get_cache_key(ticker, period)

    analysis_cache[cache_key] = {
        "timestamp": time.time(),
        "data": data,
    }


def get_period_start_date(period):
    today = datetime.today()

    period_map = {
        "1mo": today - timedelta(days=31),
        "3mo": today - timedelta(days=92),
        "6mo": today - timedelta(days=183),
        "1y": today - timedelta(days=365),
        "2y": today - timedelta(days=365 * 2),
        "3y": today - timedelta(days=365 * 3),
        "5y": today - timedelta(days=365 * 5),
    }

    return period_map.get(period, today - timedelta(days=365))


def fetch_company_name(ticker):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        return info.get("longName") or info.get("shortName") or ticker
    except Exception as error:
        print("Company name fetch failed:", error)
        return ticker


def fetch_stock_data_from_yfinance(ticker, period):
    stock = yf.Ticker(ticker)
    data = stock.history(period=period)

    if data.empty:
        raise ValueError("No data returned from Yahoo Finance.")

    return data


def fetch_stock_data_from_stooq(ticker, period):
    stooq_symbol = f"{ticker.lower()}.us"
    url = f"https://stooq.com/q/d/l/?s={stooq_symbol}&i=d"

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    response = requests.get(url, headers=headers, timeout=15)

    if response.status_code != 200:
        raise ValueError("Unable to fetch fallback data from Stooq.")

    data = pd.read_csv(StringIO(response.text))

    if data.empty or "Close" not in data.columns:
        raise ValueError("Fallback stock data not found.")

    data["Date"] = pd.to_datetime(data["Date"])
    data = data.set_index("Date")
    data = data.sort_index()

    start_date = get_period_start_date(period)
    data = data[data.index >= start_date]

    if data.empty:
        raise ValueError("Not enough fallback stock data for selected period.")

    return data


def fetch_stock_data(ticker, period):
    try:
        return fetch_stock_data_from_yfinance(ticker, period)
    except Exception as yahoo_error:
        print("Yahoo Finance failed, using Stooq fallback:", yahoo_error)
        return fetch_stock_data_from_stooq(ticker, period)


def classify_risk(annualized_volatility):
    """
    Classify stock risk based on annualized volatility.
    """
    if annualized_volatility < 0.20:
        return "Low Risk"
    elif annualized_volatility <= 0.40:
        return "Medium Risk"
    else:
        return "High Risk"


def generate_summary(ticker, annualized_volatility, risk_level):
    """
    Generate a simple beginner-friendly risk explanation.
    """
    volatility_percent = annualized_volatility * 100

    if risk_level == "Low Risk":
        return (
            f"{ticker} has low annualized volatility of {volatility_percent:.2f}%. "
            "This means the stock price has been relatively stable during the selected period. "
            "It may be more suitable for users who prefer lower price movement."
        )

    elif risk_level == "Medium Risk":
        return (
            f"{ticker} has medium annualized volatility of {volatility_percent:.2f}%. "
            "This means the stock has some price movement, but it is not extremely unstable. "
            "Users should still monitor the stock before making any decision."
        )

    else:
        return (
            f"{ticker} has high annualized volatility of {volatility_percent:.2f}%. "
            "This means the stock price has changed strongly during the selected period. "
            "It may involve higher short-term risk for users."
        )


def search_stocks(query):
    if not query or not query.strip():
        return []

    try:
        search_result = yf.Search(query, max_results=8)
        quotes = search_result.quotes

        results = []

        for quote in quotes:
            symbol = quote.get("symbol")
            short_name = quote.get("shortname")
            long_name = quote.get("longname")
            quote_type = quote.get("quoteType")
            exchange = quote.get("exchange")

            if not symbol:
                continue

            if quote_type not in ["EQUITY", "ETF"]:
                continue

            company_name = short_name or long_name or symbol

            results.append({
                "ticker": symbol,
                "name": company_name,
                "type": quote_type,
                "exchange": exchange or "N/A",
            })

        return results

    except Exception as error:
        print("Search error:", error)
        return []


def analyze_stock(ticker, period="1y"):
    """
    Download stock data and calculate basic financial risk metrics.
    Yahoo Finance is used first. If Yahoo is rate limited on Render,
    Stooq is used as a fallback for common US tickers.
    """
    ticker = ticker.upper()

    valid_periods = ["1mo", "3mo", "6mo", "1y", "2y", "3y", "5y"]
    if period not in valid_periods:
        period = "1y"

    cached_result = get_cached_analysis(ticker, period)

    if cached_result:
        return cached_result

    company_name = fetch_company_name(ticker)

    data = fetch_stock_data(ticker, period)

    if data.empty:
        raise ValueError("Invalid ticker or no data found.")

    data = data[["Open", "High", "Low", "Close", "Volume"]].copy()

    data["Daily Return"] = data["Close"].pct_change()
    data = data.dropna()

    if data.empty:
        raise ValueError("Not enough stock data found.")

    average_daily_return = data["Daily Return"].mean()
    volatility = data["Daily Return"].std()
    annualized_volatility = volatility * np.sqrt(252)

    highest_price = data["Close"].max()
    lowest_price = data["Close"].min()
    latest_price = data["Close"].iloc[-1]

    data["running_max"] = data["Close"].cummax()
    data["drawdown"] = (data["Close"] - data["running_max"]) / data["running_max"]
    maximum_drawdown = data["drawdown"].min()

    if maximum_drawdown is None or pd.isna(maximum_drawdown):
        maximum_drawdown = 0

    risk_level = classify_risk(annualized_volatility)
    summary = generate_summary(ticker, annualized_volatility, risk_level)

    price_data = []

    for date, row in data.tail(120).iterrows():
        price_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "close": round(float(row["Close"]), 2),
            "daily_return": round(float(row["Daily Return"]), 4),
        })

    result = {
        "ticker": ticker,
        "company_name": company_name,
        "period": period,
        "latest_price": round(float(latest_price), 2),
        "highest_price": round(float(highest_price), 2),
        "lowest_price": round(float(lowest_price), 2),
        "average_daily_return": round(float(average_daily_return), 4),
        "volatility": round(float(volatility), 4),
        "annualized_volatility": round(float(annualized_volatility), 4),
        "maximum_drawdown": round(float(maximum_drawdown), 4),
        "risk_level": risk_level,
        "summary": summary,
        "price_data": price_data,
    }

    save_cached_analysis(ticker, period, result)

    return result


def analyze_gold(period="1y"):
    """
    Download gold futures data and calculate gold price metrics.
    Gold data uses Yahoo Finance ticker GC=F.
    """
    valid_periods = {
        "1w": "7d",
        "1mo": "1mo",
        "3mo": "3mo",
        "1y": "1y",
        "5y": "5y",
    }

    yf_period = valid_periods.get(period, "1y")

    gold_ticker = "GC=F"
    gold = yf.Ticker(gold_ticker)

    data = gold.history(period=yf_period)

    if data.empty:
        raise ValueError("Gold price data not found.")

    data = data[["Open", "High", "Low", "Close", "Volume"]].copy()
    data["Daily Return"] = data["Close"].pct_change()
    data = data.dropna()

    if data.empty:
        raise ValueError("Not enough gold price data found.")

    latest_price = data["Close"].iloc[-1]
    previous_price = data["Close"].iloc[-2] if len(data) > 1 else latest_price

    price_change = latest_price - previous_price
    price_change_percent = price_change / previous_price if previous_price else 0

    highest_price = data["Close"].max()
    lowest_price = data["Close"].min()
    average_price = data["Close"].mean()

    volatility = data["Daily Return"].std()
    annualized_volatility = volatility * np.sqrt(252)

    data["running_max"] = data["Close"].cummax()
    data["drawdown"] = (data["Close"] - data["running_max"]) / data["running_max"]
    maximum_drawdown = data["drawdown"].min()

    if maximum_drawdown is None or pd.isna(maximum_drawdown):
        maximum_drawdown = 0

    price_data = []

    for date, row in data.iterrows():
        price_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "close": round(float(row["Close"]), 2),
            "daily_return": round(float(row["Daily Return"]), 4),
        })

    summary = (
        "Gold is commonly viewed as a safe-haven asset. Its price can move due "
        "to inflation expectations, interest rates, currency strength, central "
        "bank activity, and global uncertainty. This page uses gold futures data "
        "from Yahoo Finance ticker GC=F."
    )

    return {
        "ticker": gold_ticker,
        "asset_name": "Gold Futures",
        "period": period,
        "latest_price": round(float(latest_price), 2),
        "price_change": round(float(price_change), 2),
        "price_change_percent": round(float(price_change_percent), 4),
        "highest_price": round(float(highest_price), 2),
        "lowest_price": round(float(lowest_price), 2),
        "average_price": round(float(average_price), 2),
        "volatility": round(float(volatility), 4),
        "annualized_volatility": round(float(annualized_volatility), 4),
        "maximum_drawdown": round(float(maximum_drawdown), 4),
        "summary": summary,
        "price_data": price_data,
    }