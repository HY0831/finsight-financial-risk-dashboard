from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from risk_analysis import analyze_stock, search_stocks, analyze_gold
from auth_routes import router as auth_router
from database import Base, engine
from watchlist_routes import router as watchlist_router
from risk_profile_routes import router as risk_profile_router
from history_routes import router as history_router

app = FastAPI(
    title="FinSight API",
    description="A backend API for analysing stock risk using historical market data.",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(watchlist_router)
app.include_router(risk_profile_router)
app.include_router(history_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://finsight-financial-risk-dashboard-k.vercel.app",
    ],
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

@app.get("/health")
def health_check():
    return{
        "status": "ok",
        "service": "FinSight API",
        "database": "connected"
    }

@app.get("/search-stocks")
def search_stock_endpoint(query: str = Query(..., min_length=1)):
    results = search_stocks(query)
    return {
        "query": query,
        "results": results
    }

@app.get("/analyze/{ticker}")
def analyze_stock_endpoint(ticker: str, period: str = "1y"):
    try:
        result = analyze_stock(ticker, period)
        return result

    except Exception as error:
        error_message = str(error)

        print("Analyze stock backend error:", error_message)

        if "Too Many Requests" in error_message or "Rate limited" in error_message:
            raise HTTPException(
                status_code=429,
                detail="Yahoo Finance is temporarily rate limited. Please try again later."
            )

        raise HTTPException(
            status_code=500,
            detail=error_message
        )

@app.get("/gold-price")
def gold_price_endpoint(period: str="1y"):
    try:
        result = analyze_gold(period)
        return result
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error))
        