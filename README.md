# FinSight: AI-Powered Financial Risk Dashboard

FinSight is an educational and portfolio-based financial risk dashboard that helps users analyse stock risk using historical market data. The system calculates return, volatility, annualized volatility, and classifies stock risk into Low, Medium, or High Risk.

The project also includes stock comparison, user risk profile analysis, watchlist management, recent analysis history, PDF report generation, and personalised dashboard highlights.

## Live Demo
Frontend:https://finsight-financial-risk-dashboard-k.vercel.app/
Backend API: https://finsight-financial-risk-dashboard.onrender.com

## Project Purpose
The purpose of FinSight is to make stock risk analysis easier for beginner users to understand. Instead of only showing stock price data, FinSight converts historical market data into simple and meaningful risk insights.

This project was developed as a personal portfolio project to demonstrate skills in:

- Full-stack web development
- Financial risk analysis
- API development
- Data processing
- React frontend development
- FastAPI backend development
- Dashboard UI design
- PDF report generation
- Local data persistence

### Key Features

## Stock Risk Analysis
Users can search for a stock by ticker or company name. FinSight retrieves historical stock data and calculates:
- Latest stock price
- Highest price
- Lowest price
- Average daily return
- Daily volatility
- Annualized volatility
- Stock risk level

The stock is classified as:
| Risk Level  | Annualized Volatility | Meaning                                       |
| ----------- | --------------------: | --------------------------------------------- |
| Low Risk    |             Below 20% | Smaller price movements                       |
| Medium Risk |            20% to 40% | Moderate price movements                      |
| High Risk   |             Above 40% | Larger price movements and higher uncertainty |

## Dynamic Stock Search
FinSight allows users to search by ticker, company name, or similar company name.

Examples:
- AAPL
- Apple
- TSLA
- Tesla
- MSFT
- Microsoft

This helps users who may not know the exact stock ticker.

## Analysis Period Selection
Users can select different analysis periods:
- 6 Months
- 1 Year
- 3 Years
- 5 Years

The selected period is used for stock analysis, stock comparison, watchlist refresh, and risk calculation.

## Stock Risk Insight Summary
After analysing a stock, FinSight provides a simple explanation of the result, including:
- Risk level explanation
- Return explanation
- Volatility explanation
- Suitability notes

This helps beginner users understand the mearning behind the financial metrics.

## Stock Comparison
Users can compare two stocks side by side using the same selected analysis period.

The comparison includes:
- Company name
- Latest price
- Average daily return
- Daily volatility
- Annualized volatility
- Risk level
- Comparison summary
- Comparison recommendation summary

The recommendation summary highlights:
- Lower risk stock
- Higher risk stock
- Higher average return stock
- Conservative user view
- Overall comparison insight

## Watchlist
Users can save analysed stocks into a personal watchlist.

The Watchlist page includes:
- Saved stock cards
- Latest price
- Risk level
- Annualized volatility
- Saved time
- Last updated time
- Analyse again button
- Remove stock button
- Clear watchlist button

The watchlist is stored locally in the user's browser using localStorage.

## Watchlist Refresh
Users can refresh saved stocks to update:
- Latest price
- Risk level
- Annualized volatility
- Last updated time

This makes the watchlist more useful for monitoring saved stocks over time.

## Watchlist Risk Distribution
The Watchlist page includes a risk distribution summary showing how saved stocks are grouped by:
- Low Risk
- Medium Risk
- High Risk

This gives users a quick overview of their saved stock risk exposure.

## Compare from Watchlist
Users can select two saved stocks from the Watchlist page and send them directly to the Compare page.

This improves the user flow because users do not need to type the same stock tickers again.

## User Risk Profile
FinSight includes a simplified user risk profile questionnaire. The questionnaire asks about:
- Investment objective
- Investment time horizon
- Expected need for money
- Reaction to market loss
- Comfort with short-term price movement
- Investment knowledge and experience
- Financial stability

Based on the total score, users are classified as:
| Total Score | User Risk Profile |
| ----------: | ----------------- |
|      7 - 16 | Conservative      |
|     17 - 26 | Moderate          |
|     27 - 35 | Aggressive        |

The risk profile result and questionnaire answers are saved locally using localStorage, so the result remains available after refreshing the website.

## Suitability Analysis
FinSight compares the user’s risk profile with the analysed stock’s risk level to generate a simple suitability explanation.

Example:
User Risk Profile: Conservative
Stock Risk Level: High Risk
Suitability Result: Not Highly Suitable

This feature helps users understand whether a stock’s risk level generally matches their personal risk tolerance. It is for educational purposes only and does not provide investment advice.

## Analysis History
FinSight stores recent stock analysis records locally in the browser.

The History page includes:
- Recent analysed stocks
- Total search summary
- Low, Medium, and High Risk summary
- Search by ticker or company name
- Filter by risk level
- Analyse again button
- Clear history button

## Home Dashboard Highlights
After a user has analysed at least one stock, the Home page displays personalised dashboard highlights, including:
- Recent searches
- Watchlist stocks
- Risk profile status
- Default analysis period

For new users with no analysis history, the Home page remains simple and introductory.

## Recent Analysis Preview
After analysing stocks, the Home page shows a preview of the latest analysed stocks. Users can quickly review recent activity and access the full History page.

## PDF Risk Report
Users can download a professional PDF report for an analysed stock.

The PDF report includes:
- Executive summary
- Key risk metrics
- Price overview
- Risk insight
- Historical price chart
- Daily return chart
- User risk profile
- Suitability analysis
- Risk classification method
- Disclaimer

## Improved Error Messages
FinSight provides clearer error messages for common issues such as:
- Backend server not connected
- Empty stock input
- Stock not found
- Not enough data
- Invalid comparison input
- Same stock selected for comparison

The messages include suggestions to help users understand and solve the issue.

### Website Pages
## Home Page

The Home page introduces FinSight and provides a quick overview of the system. It includes a hero section, popular stock trend cards, dashboard highlights after analysis, recent analysis preview, feature highlights, risk classification preview, and call-to-action buttons.

## Analyze Page

The Analyze page allows users to search for a stock by ticker or company name, select an analysis period, view stock risk metrics, read risk insight summaries, view charts, add the stock to watchlist, and generate a PDF risk report.

## Compare Page

The Compare page allows users to compare two stocks side by side using the same selected analysis period. It compares latest price, average daily return, daily volatility, annualized volatility, risk level, and provides a comparison recommendation summary.

## Watchlist Page

The Watchlist page allows users to save, refresh, filter, sort, remove, clear, and compare saved stocks. It also includes watchlist summary cards and risk distribution bars.

## Risk Profile Page

The Risk Profile page includes a questionnaire that classifies the user as Conservative, Moderate, or Aggressive. The result is stored locally and used in suitability analysis.

## History Page

The History page displays recent stock analysis records stored locally in the browser. Users can search, filter, re-analyse previous stocks, and clear their history.

## About Page

The About page explains the project overview, methodology, risk formulas, risk classification method, risk profile logic, suitability analysis, technology stack, and educational disclaimer.

### Tech Stack

## Frontend
- React
- Vite
- React Routers
- Recharts
- jsPDF
- JavaSript
- HTML
- CSS

## Backend
- Python
- FastAPI
- Pandas
- NumPy
- yfinance
- Uvicorn

## Tools and Deployment
- Git
- GitHub
- Visual Studio Code
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
│   │   │   ├── WatchlistPage.jsx
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

## Local Data Storage
FinSight uses broweser localStorage to store selected user data locally.

Stored items include:
| Data                 | Purpose                                             |
| -------------------- | --------------------------------------------------- |
| Search history       | Stores recent stock analysis records                |
| Watchlist            | Stores saved stocks for future monitoring           |
| Risk profile answers | Stores questionnaire answers                        |
| User risk profile    | Stores Conservative, Moderate, or Aggressive result |

This project currently does not use user login or a databse. Database-based storage may be added in a future version.

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

### API Endpoint

## Home Endpoint

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

## Stock Analysis Endpoint

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
## Stock Search Endpoint

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

### How to Run the Project

## 1. Clone the Repository

```bash
git clone https://github.com/HY0831/finsight-financial-risk-dashboard.git
cd finsight-financial-risk-dashboard
```

## 2. Run the Backend

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

## 3. Run the Frontend

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

### Current Version

## Version 1: Stock Risk Analysis Dashboard
- Added stock ticker search
- Retrieved stock price data
- Calculated return and volatility
- Added stock risk classification
- Displayed dashboard charts
- Added simple risk summary

## Version 2: User Risk Profile and Suitability Analysis
- Added user risk profile questionnaire
- Added Conservative, Moderate, and Aggressive classification
- Added suitability matching between user risk profile and stock risk level
- Added personalised suitability explanation

## Version 3: PDF Risk Report
- Added downloadable PDF risk report
- Included stock information, risk metrics, user risk profile, suitability analysis, and disclaimer in the report

## Version 4: Stock Comparison
- Added side-by-side stock comparison
- Compared latest price, average daily return, annualized volatility, and risk level
- Added comparison summary based on volatility

## Version 5: Recent Search History
- Added recent search history using browser localStorage
- Allowed users to re-analyse stocks from history
- Added clear history function
- Improved recent search history design

## Version 6: Frontend Refactor
- Refactored frontend into reusable React components
- Improved code structure and maintainability
- Separated major features into component and page files

## Version 7: UI and UX Improvement
- Added empty state before stock analysis
- Added metric explanation text for beginner users
- Added dashboard result title and explanation
- Added footer disclaimer
- Improved overall UI clarity

## Version 8: Dynamic Stock Search and Improved PDF Report
- Added dynamic stock search suggestions using backend search endpoint
- Allowed users to search by ticker, company name, or similar company name
- Added search suggestions to stock comparison inputs
- Improved PDF report layout, charts, insights, risk profile, suitability analysis, and disclaimer
- Fixed PDF generation when user risk profile is completed

## Version 9: Multi-Page Website Layout
- Converted FinSight from a single-page dashboard into a multi-page web application
- Added Home, Analyze, Compare, Risk Profile, History, and About pages
- Added navigation bar
- Improved user flow by separating each major function into its own page

## Version 10: Home and Dashboard Personalisation
- Added popular stock trend cards
- Added personalised Home dashboard highlights after analysis
- Added recent analysis preview on Home page
- Improved Home page layout and call-to-action sections

## Version 11: Watchlist Management
- Added Watchlist page
- Added save and remove stock function
- Added clear watchlist function
- Added watchlist summary cards
- Stored saved stocks using localStorage

## Version 12: Watchlist Refresh and Risk Distribution
- Added refresh watchlist data function
- Added last updated time
- Added watchlist risk distribution bar
- Added filter and sort function for saved stocks

## Version 13: Compare from Watchlist
- Allowed users to select two saved stocks from Watchlist
- Sent selected stocks to Compare page automatically
- Improved watchlist-to-comparison user flow

## Version 14: Improved About and History Pages
- Added methodology section to About page
- Added formula explanation for daily return and volatility
- Improved History page with summary cards, search, filter, and better empty state

## Version 15: Saved Risk Profile and Better Analysis Insights
- Saved risk profile answers and result using localStorage
- Added reset risk profile function
- Added stock risk insight summary on Analyze page
- Improved suitability note display

## Version 16: Better Error Handling and Comparison Recommendation
- Added user-friendly error messages
- Added error suggestions for common issues
- Added comparison recommendation summary
- Improved Compare page result clarity

### Future Improvements

Possible future improvements include:
- User login and authentication
- Database support for saved analysis records
- Account-based watchlist and risk profile storage
- Portfolio-level risk score
- Portfolio weight calculation
- Watchlist PDF summary report
- More advanced financial indicators
- Sector and industry analysis
- AI-generated personalised explanation
- Dark mode
- Mobile app version

### Learning Outcomes

Through this project, I practised:
- Building a full-stack web application
- Creating backend APIs using FastAPI
- Fetching stock market data using yfinance
- Processing financial data using pandas and NumPy
- Calculating return and volatility
- Designing a dashboard using React and Recharts
- Creating a multi-page React application using React Router
- Creating a user risk profile questionnaire
- Generating PDF reports using jsPDF
- Using browser localStorage for search history, watchlist, and risk profile
- Refactoring React code into reusable components
- Improving UI and UX design for dashboard-based applications
- Handling user-friendly error messages
- Structuring a GitHub portfolio project
- Deploying frontend and backend services
- Combining computer science and finance concepts in one project

### Disclaimer

This project is developed for educational and portfolio purposes only.

FinSight does not provide financial advice, investment recommendations, trading instructions, or professional financial planning services. Users should not rely on this system as the only basis for making investment decisions.

### References

- FINRA. Know Your Risk Tolerance. Available at: https://www.finra.org/investors/investing/investing-basics/know-your-risk-tolerance
- Vanguard. Investor Questionnaire. Available at: https://investor.vanguard.com/tools-calculators/investor-questionnaire
- CIRO. Investor Questionnaire. Available at: https://www.ciro.ca
- Ameriprise. Investment Risk Tolerance Quiz. Available at: https://www.ameriprise.com/financial-goals-priorities/investing/investment-risk-tolerance-quiz
- Yahoo Finance data accessed using the yfinance Python library.

### Author

Developed by Tey Hui Yang  
Bachelor of Computer Science, Taylor's University  
Minor in Finance