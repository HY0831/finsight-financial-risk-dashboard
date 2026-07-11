# FinSight: AI-Powered Financial Risk Dashboard

FinSight is a full-stack financial risk analysis web application that helps users understand stock risk using historical market data. The system retrieves real stock price data, calculates financial risk metrics, classifies stock risk level, and displays the results through a clean multi-page dashboard interface.

FinSight also includes a simplified user risk profile questionnaire that identifies whether a user has a Conservative, Moderate, or Aggressive investment risk profile. The project combines stock risk analysis, user risk tolerance analysis, suitability matching, stock comparison, recent search history, popular stock trends, and PDF report generation.

## Project Overview

Many beginner investors and students find it difficult to understand stock risk because financial data is often presented in a complex way. They may see stock prices, charts, and financial numbers, but may not know how to interpret return, volatility, or risk level.

FinSight aims to simplify this problem by converting historical stock market data into visual charts, financial risk indicators, and beginner-friendly explanations.

This project was developed as a personal portfolio project to combine computer science, finance knowledge, data analysis, and full-stack web development.

## Live Demo
Frontend:https://finsight-financial-risk-dashboard-k.vercel.app/
Backend API: https://finsight-financial-risk-dashboard.onrender.com

## Features

- Multi-page website layout with navigation
- Home, Analyze, Compare, Risk Profile, History, and About pages
- Popular stock trend cards on the Home page
- Stock search by ticker, company name, or similar company name
- Dynamic stock suggestions using backend search endpoint
- Historical stock risk analysis
- Selectable analysis period: 6 months, 1 year, 3 years, or 5 years
- Average daily return calculation
- Daily volatility calculation
- Annualized volatility calculation
- Stock risk classification: Low Risk, Medium Risk, or High Risk
- Price trend and daily return visualisation
- User risk profile questionnaire
- Suitability analysis between user risk profile and stock risk level
- Side-by-side stock comparison
- Recent search history using localStorage
- Downloadable professional PDF risk report
- Educational disclaimer and About page

### Website Pages
## Home Page

The Home page introduces FinSight and provides a quick overview of the system. It includes a hero section, popular stock trend cards, feature highlights, risk classification preview, and call-to-action buttons.

## Analyze Page

The Analyze page allows users to search for a stock by ticker or company name, select an analysis period, view stock risk metrics, view price charts, and generate a PDF risk report.

## Compare Page

The Compare page allows users to compare two stocks side by side using the same selected analysis period. It compares latest price, average daily return, annualized volatility, and stock risk level.

## Risk Profile Page

The Risk Profile page includes a questionnaire that classifies the user as Conservative, Moderate, or Aggressive. This result is used in the suitability analysis between the user profile and stock risk level.

## History Page

The History page displays recent stock searches stored locally in the browser. Users can quickly re-open previous stock analyses or clear their search history.

## About Page

The About page explains the project purpose, risk classification method, technology stack, and educational disclaimer.

## Tech Stack

### Frontend

- React
- Vite
- React Routers
- Recharts
- jsPDF
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
- Vercel
- Render

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
├── backend/
│   ├── main.py
│   ├── risk_analysis.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── TrendingStocks.jsx
│   │   │   ├── SearchSection.jsx
│   │   │   ├── StockDashboard.jsx
│   │   │   ├── ComparisonSection.jsx
│   │   │   ├── RiskProfileSection.jsx
│   │   │   ├── HistorySection.jsx
│   │   │   └── EmptyState.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── AnalyzePage.jsx
│   │   │   ├── ComparePage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   └── AboutPage.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
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

## Suitability Analysis

FinSight compares the user's risk profile with the stock risk level to generate a simple suitability explanation.

Example:

```text
User Risk Profile: Conservative
Stock Risk Level: High Risk
Suitability Result: Not Highly Suitable
```

This feature is designed to help users understand whether a stock's risk level generally matches their personal risk tolerance. It is for educational purposes only and does not provide investment advice.

## Stock Comparison

FinSight allows users to compare two stocks side by side using the same selected analysis period.

The comparison includes:

- Company name
- Latest price
- Average daily return
- Annualized volatility
- Risk level
- Simple comparison insight based on volatility

Example comparison:

```text
AAPL vs TSLA
```

The system compares annualized volatility and explains which stock had larger price movement during the selected period.

## Popular Stock Trends

FinSight includes popular stock trend cards on the Home page. These cards automatically switch between selected popular stocks and give users a quick overview of recent stock risk movement.

The trend cards display:
- Stock ticker
- Company name
- Latest price
- Annualized volatility
- Risk level
- Risk movement bar

This feature makes the Home page feel closer to a real financial web application.

## Recent Search History

FinSight saves recent stock searches using browser localStorage.

The recent search history stores:

- Ticker
- Company name
- Risk level
- Analysis period
- Latest price
- Search time

Users can click a recent search item to analyse the stock again. Users can also clear the search history.

This feature is currently stored locally in the browser. Database-based search history may be added after user login is implemented in the future.

## PDF Risk Report

FinSight can generate a downloadable PDF stock risk report.

The PDF report includes:

- Stock ticker
- Company name
- Analysis period
- Latest price
- Highest and lowest price
- Average daily return
- Daily volatility
- Annualized volatility
- Stock risk level
- Price trend chart
- Daily return chart
- User risk profile
- Suitability analysis
- Executive insight
- Risk classification method
- Disclaimer

This feature helps make the project more practical and report-oriented.

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

### Stock Search Endpoint

```text
GET /search-stocks?query={searchText}
```

Example:
```text
GET /search-stocks?query=apple
```

Example response:
```JSON
{
  "query": "apple",
  "results": [
    {
      "ticker": "AAPL",
      "name": "Apple Inc.",
      "type": "EQUITY",
      "exchange": "NMS"
    }
  ]
}
```
The end point is used for dynamic stock suggestions in both the Analyze page and Compare page.

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

## Deployment Notes

The frontend is deployed using Vercel, while the backend API is deployed using Render.

For frontend development, the Vercel project should use the following environment variable:
VITE_API_BASE_URL=https://finsight-financial-risk-dashboard.onrender.com

This allows the deployed frontend to connect to the deployed backend API instead of the local development server.

## Screenshots

Screenshots are stored in the `screenshots` folder.

Suggested screenshots:

```text
homepage.png
popular-stock-trends.png
analyze-page.png
stock-dashboard.png
stock-price-chart.png
compare-page.png
comparison-result.png
risk-profile-page.png
risk-profile-result.png
history-page.png
about-page.png
pdf-report.png
api-docs.png
```

## Current Version

### Version 1: Stock Risk Analysis Dashboard

- Stock ticker search
- Stock price data retrieval
- Risk metric calculation
- Stock risk classification
- Dashboard chart display
- Simple risk summary

### Version 1.1: Dashboard Enhancement

- Added company name
- Added analysis period selection
- Improved loading button state
- Improved dashboard details

### Version 2: User Risk Profile and Suitability Analysis

- Added user risk profile questionnaire
- Added user risk profile scoring
- Added Conservative, Moderate, and Aggressive classification
- Added source note for questionnaire design
- Added suitability matching between user risk profile and stock risk level
- Added personalised suitability explanation

### Version 3: PDF Risk Report

- Added downloadable PDF risk report
- Included stock information, risk metrics, user risk profile, suitability analysis, and disclaimer in the report

### Version 4: Stock Comparison

- Added side-by-side stock comparison
- Compared company name, latest price, average daily return, annualized volatility, and risk level
- Added simple comparison summary based on volatility
- Improved comparison section layout and readability

### Version 5: Recent Search History

- Added recent search history
- Stored recent searches using browser localStorage
- Allowed users to re-analyse stocks from search history
- Added clear history function
- Improved recent search history card design

### Version 6: Frontend Refactor

- Refactored frontend into reusable React components
- Improved code structure and maintainability
- Separated search, history, comparison, questionnaire, dashboard, and suitability sections into individual component files

### Version 7: UI and UX Improvement

- Added empty state section before stock analysis
- Added metric explanation text for beginner users
- Added dashboard result title and explanation
- Added footer disclaimer
- Improved overall UI clarity and user experience

### Version 8: Dynamic Stock Search and Improved PDF Report
- Added dynamic stock search suggestions using backend search endpoint
- Allowed users to search by ticker, company name or similar company name
- Added dynamic search suggestions to stock comparison inputs
- Improved PDF report design with professional layout, colour-coded metric cards, charts, insights, risk profile, suitability analysis and disclaimer
- Fixed PDF generation when user risk profile is completed

### Version 9: Multi-Page Website Layout

- Converted FinSight from a single-page dashboard into a multi-page web application
- Added navigation bar with Home, Analyze, Compare, Risk Profile, History, and About pages
- Added a professional Home page with popular stock trend cards
- Improved user flow by separating each major function into its own page
- Made the website feel closer to a real financial web application

### Version 10: Multi-Page Professional Website Upgrade

- Converted FinSight from a single-page dashboard into a multi-page web application
- Added navigation bar with Home, Analyze, Compare, Risk Profile, History, and About pages
- Added a professional Home page with trending popular stock cards
- Improved Analyze page layout with guide cards, better loading state, and cleaner error display
- Improved Compare page layout with explanation cards and clearer comparison flow
- Improved Risk Profile page with investor profile explanation cards
- Improved History page with recent-search explanation and empty-state action
- Improved About page with project purpose, risk method, tech stack, and disclaimer sections
- Improved overall user flow to make FinSight feel closer to a real financial web application

## Future Improvements

- Add user login and authentication
- Save search history to a database after login is added
- Save user risk profile permanently
- Add stock watchlist feature
- Add database support for saved analysis records
- Add AI-generated personalised explanation
- Add more advanced financial indicators
- Improve PDF report with more detailed chart visuals
- Add portfolio-level risk analysis

## Learning Outcomes

Through this project, I practised:

- Building a full-stack web application
- Creating backend APIs using FastAPI
- Fetching real stock market data using yfinance
- Processing financial data using Pandas and NumPy
- Calculating return and volatility
- Designing a dashboard using React and Recharts
- Creating a multi-page React application using React Router
- Creating a user risk profile questionnaire
- Generating PDF reports using jsPDF
- Using browser localStorage for recent search history
- Refactoring React code into reusable components
- Improving UI/UX design for dashboard-based applications
- Structuring a GitHub portfolio project
- Deploying frontend and backend services
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