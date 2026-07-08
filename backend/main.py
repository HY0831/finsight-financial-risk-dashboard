from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from risk_analysis import analyze_stock

app = FastAPI(
    title = "FinSight API",
    decription = "API for stock risk analysis using historical market data",
    version = "1.0.0"
)

#Allow frontend to connect to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], #For development only
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

@app.get("/")
def home():
    return {
        "message": "Welcome to FinSight API",
        "example": "/analyze/AAPL"
    }

@app.get("/analyze/{ticker}")
def analyze(ticker: str):
    try:
        result = analyze_stock(ticker)
        return result
    
    except ValueError as error:
        raise HTTPException(status_code = 404, detail = str(error))
    
    except Exception as error:
        raise HTTPException(status_code = 500, detail = "Something went wrong while analysing the stock.")
