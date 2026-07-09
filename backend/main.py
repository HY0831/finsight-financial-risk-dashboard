from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from risk_analysis import analyze_stock, search_stocks

app = FastAPI(
    title="FinSight API",
    description="A backend API for analysing stock risk using historical market data.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "project": "FinSight",
        "message": "Welcome to FinSight API",
        "description": "Use /analyze/{ticker} to analyse stock risk.",
        "example": "/analyze/AAPL"
    }

@app.get("/search-stocks")
def search_stock_endpoint(query: str = Query(..., min_length=1)):
    results = search_stocks(query)
    return {
        "query": query,
        "results": results
    }

@app.get("/analyze/{ticker}")
def analyze(ticker: str, period: str = Query(default="1y")):
    try:
        result = analyze_stock(ticker, period)
        return result

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while analysing the stock."
        )