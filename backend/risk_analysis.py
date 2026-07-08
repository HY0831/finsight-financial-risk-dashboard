import yfinance as yf
import pandas as pd
import numpy as np

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
    Generate a simple beginner_friendly risk explanation.
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

def analyze_stock(ticker, period="1y"):
    """
    Download stock data and calculate basic financial risk metrics.
    """
    ticker = ticker.upper()

    #Download historical stock data for the specified period
    stock = yf.Ticker(ticker)
    company_name = stock.info.get("longName", ticker)  # Use ticker as fallback if longName is not available

    valid_periods = ["1mo", "3mo", "6mo", "1y", "2y", "3y", "5y"]
    if period not in valid_periods:
        period = "1y"  # Default to 1 year if invalid period is provided
    data = stock.history(period=period)

    if data.empty:
        raise ValueError("Invalid ticker or no data found.")
    
    #Keep only useful columns
    data = data[["Open","High","Low","Close","Volume"]].copy()

    #Calculate daily return
    data["Daily Return"] = data["Close"].pct_change()

    #Remove first row because daily return will be empty
    data = data.dropna()

    #Calculate metrics
    average_daily_return = data["Daily Return"].mean()
    volatility = data["Daily Return"].std()
    annualized_volatility = volatility * np.sqrt(252)
    
    highest_price = data["Close"].max()
    lowest_price = data["Close"].min()
    latest_price = data["Close"].iloc[-1]

    risk_level = classify_risk(annualized_volatility)
    summary = generate_summary(ticker,annualized_volatility,risk_level)

    #Prepare chart data for frontend
    price_data = []

    for date, row in data.tail(120).iterrows():
        price_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "close": round(float(row["Close"]),2),
            "daily_return": round(float(row["Daily Return"]),4)
        })
    
    result = {
        "ticker": ticker,
        "company_name": company_name,
        "period": period,
        "latest_price": round(float(latest_price),2),
        "highest_price": round(float(highest_price),2),
        "lowest_price": round(float(lowest_price),2),
        "average_daily_return": round(float(average_daily_return), 4),
        "volatility": round(float(volatility), 4),
        "annualized_volatility": round(float(annualized_volatility), 4),
        "risk_level": risk_level,
        "summary": summary,
        "price_data": price_data
    }

    return result
