# FinSight: AI-Powered Financial Risk Dashboard

FinSight is a full-stack financial risk analysis dashboard that helps users understand stock risk using historical market data. The system retrieves real stock price data, calculates financial risk metrics, classifies the stock risk level, and displays the results through a clean dashboard interface.

FinSight also includes a simplified user risk profile questionnaire that identifies whether a user has a Conservative, Moderate, or Aggressive investment risk profile. This allows the project to combine stock risk analysis with basic user risk tolerance analysis.

## Project Overview

Many beginner investors and students find it difficult to understand stock risk because financial data is often presented in a complex way. They may see stock prices, charts, and financial numbers, but may not know how to interpret return, volatility, or risk level.

FinSight aims to simplify this problem by converting historical stock market data into visual charts, financial risk indicators, and beginner-friendly explanations.

This project was developed as a personal portfolio project to combine computer science, finance knowledge, data analysis, and full-stack web development.

## Features

- Search stock ticker such as AAPL, TSLA, MSFT, NVDA, or KO
- Retrieve historical stock market data
- Select analysis period: 6 months, 1 year, 3 years, or 5 years
- Display company name and latest stock price
- Calculate average daily return
- Calculate daily volatility
- Calculate annualized volatility
- Classify stock risk level as Low Risk, Medium Risk, or High Risk
- Display stock price trend chart
- Display daily return trend chart
- Show recent historical stock data
- Generate simple risk explanation
- Identify user investment risk profile using a questionnaire
- Classify user risk profile as Conservative, Moderate, or Aggressive
- Display user risk profile score and explanation
- Match user risk profile with stock risk level
- Generate a simple suitability explanation
- Generate a downloadable PDF stock risk report
- Save recent stock searches using browser localStorage
- Allow users to click recent searches to analyse the stock again
- Clear recent search history

## Tech Stack

### Frontend

- React
- Vite
- Recharts
- CSS

### Backend

- Python
- FastAPI
- Pandas
- NumPy
- yfinance

### Tools

- Git
- GitHub
- VS Code

## System Architecture

```text
User
 ↓
React Frontend
 ↓
FastAPI Backend
 ↓
Risk Analysis Module
 ↓
Yahoo Finance Data
 ↓
Dashboard Result
```

## Project Structure

```text
finsight-dashboard/
│
├── backend/
│   ├── main.py
│   ├── risk_analysis.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchSection.jsx
│   │   │   ├── HistorySection.jsx
│   │   │   ├── ComparisonSection.jsx
│   │   │   ├── RiskProfileSection.jsx
│   │   │   ├── StockDashboard.jsx
│   │   │   └── SuitabilitySection.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── eslint.config.js
│   └── vite.config.js
│
├── screenshots/
│
├── .gitignore
└── README.md
```

## Risk Calculation Method

FinSight uses historical closing price data to calculate stock return and volatility.

### Daily Return

```text
Daily Return = (Today Close Price - Yesterday Close Price) / Yesterday Close Price
```

In Python:

```python
data["Daily Return"] = data["Close"].pct_change()
```

### Average Daily Return

```python
average_daily_return = data["Daily Return"].mean()
```

### Daily Volatility

```python
volatility = data["Daily Return"].std()
```

### Annualized Volatility

```text
Annualized Volatility = Daily Volatility × √252
```

In Python:

```python
annualized_volatility = volatility * np.sqrt(252)
```

The value 252 is used because there are approximately 252 trading days in one year.

## Stock Risk Classification

The system classifies stock risk based on annualized volatility.

| Annualized Volatility | Stock Risk Level |
|---|---|
| Less than 20% | Low Risk |
| 20% to 40% | Medium Risk |
| More than 40% | High Risk |

This classification is used to provide a simple risk interpretation for beginner users.

## User Risk Profile Questionnaire

FinSight includes a simplified user risk profile questionnaire to identify the user's investment risk tolerance.

The questionnaire is adapted for educational purposes based on common investor risk profiling factors discussed by investor education and financial planning resources such as FINRA, Vanguard, CIRO, and Ameriprise.

The questionnaire considers the following factors:

- Investment objective
- Investment time horizon
- Expected need for money
- Reaction to market loss
- Comfort with short-term price movement
- Investment knowledge and experience
- Financial stability

Each question is scored from 1 to 5. A lower score represents lower risk tolerance, while a higher score represents higher risk tolerance.

| Total Score | User Risk Profile |
|---|---|
| 7 - 16 | Conservative |
| 17 - 26 | Moderate |
| 27 - 35 | Aggressive |

### Risk Profile Meaning

| Risk Profile | Description |
|---|---|
| Conservative | The user prefers stability and capital protection. |
| Moderate | The user can accept some investment risk for potential growth but prefers a balanced approach. |
| Aggressive | The user is willing to accept higher risk and larger price movements for potential higher long-term returns. |

This feature is currently implemented without user login. The result is calculated on the frontend and is not saved permanently. User login and saved risk profiles may be added in a future version.

## API Endpoint

### Home Endpoint

```text
GET /
```

Example response:

```json
{
  "project": "FinSight",
  "message": "Welcome to FinSight API",
  "description": "Use /analyze/{ticker} to analyse stock risk.",
  "example": "/analyze/AAPL"
}
```

### Stock Analysis Endpoint

```text
GET /analyze/{ticker}?period={period}
```

Example:

```text
GET /analyze/AAPL?period=1y
```

Supported periods:

| Period | Meaning |
|---|---|
| 6mo | 6 months |
| 1y | 1 year |
| 3y | 3 years |
| 5y | 5 years |

Example response:

```json
{
  "ticker": "AAPL",
  "company_name": "Apple Inc.",
  "period": "1y",
  "latest_price": 215.24,
  "highest_price": 237.33,
  "lowest_price": 169.21,
  "average_daily_return": 0.0011,
  "volatility": 0.0182,
  "annualized_volatility": 0.2889,
  "risk_level": "Medium Risk",
  "summary": "AAPL has medium annualized volatility...",
  "price_data": [
    {
      "date": "2026-01-01",
      "close": 180.25,
      "daily_return": 0.012
    }
  ]
}
```

## How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/HY0831/finsight-financial-risk-dashboard.git
cd finsight-financial-risk-dashboard
```

### 2. Run the Backend

Go to the backend folder:

```bash
cd backend
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### 3. Run the Frontend

Open another terminal and go to the frontend folder:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173/
```

## Screenshots

Screenshots are stored in the `screenshots` folder.

Suggested screenshots:

```text
homepage.png
dashboard-aapl.png
stock-price-chart.png
risk-profile-questionnaire.png
risk-profile-result.png
api-docs.png
```

## Current Version

### Version 1

- Stock ticker search
- Stock price data retrieval
- Risk metric calculation
- Stock risk classification
- Dashboard chart display
- Simple risk summary

### Version 1.1

- Added company name
- Added analysis period selection
- Improved loading button state
- Improved dashboard details

### Version 2

- Added user risk profile questionnaire
- Added user risk profile scoring
- Added Conservative, Moderate, and Aggressive classification
- Added source note for questionnaire design
- Added suitability matching between user risk profile and stock risk level
- Added personalised suitability explanation
- Added downloadable PDF risk report
- Included stock information, risk metrics, user risk profile, suitability analysis and disclaimer in the report

### Version 3
- Added side-by-side stock comparison
- Compared company name, latest price, average daily return, annualized volatility and risk level
- Added simple comparison summary based on volatility

### Version 4
- Added recent search history
- Stored recent searches using browser localStorage
- Allowed users to re-anlyse stocks from search history
- Added clear history function

### Version 5
- Refactored frontend into reusable React components
- Improved code structure and maintainability
- Separated search, history, comparison, questionnaire, dashboard and suitability sections into individual component files

### Version 6
- Added empty state section before stock analysis
- Added metric explanation text for beginner users
- Added dashboard result title and explanation
- Added footer disclaimer
- Improved overall UI clarity and user experience

## Future Improvements
- Save search history to database after user login is added
- Add user login and saved risk profile
- Add AI-generated personalised explanation
- Deploy frontend and backend online

## Learning Outcomes

Through this project, I practised:

- Building a full-stack web application
- Creating backend APIs using FastAPI
- Fetching real stock market data using yfinance
- Processing financial data using Pandas and NumPy
- Calculating return and volatility
- Designing a dashboard using React and Recharts
- Creating a user risk profile questionnaire
- Structuring a GitHub portfolio project
- Combining computer science and finance concepts in one project

## Disclaimer

This project is developed for educational and portfolio purposes only.

FinSight does not provide financial advice, investment recommendations, trading instructions, or professional financial planning services. Users should not rely on this system as the only basis for making investment decisions.

## References

- FINRA. Know Your Risk Tolerance. Available at: https://www.finra.org/investors/investing/investing-basics/know-your-risk-tolerance
- Vanguard. Investor Questionnaire. Available at: https://investor.vanguard.com/tools-calculators/investor-questionnaire
- CIRO. Investor Questionnaire. Available at: https://www.ciro.ca
- Ameriprise. Investment Risk Tolerance Quiz. Available at: https://www.ameriprise.com/financial-goals-priorities/investing/investment-risk-tolerance-quiz
- Yahoo Finance data accessed using the yfinance Python library.

## Author

Developed by Tey Hui Yang  
Bachelor of Computer Science, Taylor's University  
Minor in Finance