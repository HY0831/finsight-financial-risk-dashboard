# FinSight: AI-Powered Financial Risk Dashboard

FinSight is a full-stack financial risk analysis dashboard that helps users analyse stock risk using historical market data. The system converts stock price data into simple risk insights such as average daily return, daily volatility, annualized volatility, and risk level.

The project also includes stock comparison, dynamic stock search, watchlist management, user risk profile analysis, analysis history, PDF report generation, user authentication, and database-backed user storage.

FinSight supports both guest users and logged-in users. Guest users can try the system using browser localStorage, while logged-in users can save their watchlist, risk profile, and analysis history to a PostgreSQL database.

---

## Live Demo

Frontend: https://finsight-financial-risk-dashboard-k.vercel.app/

Backend API: https://finsight-financial-risk-dashboard.onrender.com

---

## Project Purpose

The purpose of FinSight is to make stock risk analysis easier for beginner users to understand. Instead of only showing stock price data, FinSight explains stock risk using simple metrics, charts, and beginner-friendly summaries.

This project was developed as a personal portfolio project to demonstrate skills in:

- Full-stack web development
- React frontend development
- FastAPI backend development
- API development
- Database-backed user features
- JWT authentication
- Financial risk analysis
- Data processing
- Dashboard UI design
- PDF report generation
- Full-stack deployment

---

## Key Features

### Stock Risk Analysis

Users can search for a stock by ticker or company name. FinSight retrieves historical stock data and calculates:

- Latest stock price
- Highest price
- Lowest price
- Average daily return
- Daily volatility
- Annualized volatility
- Stock risk level
- Historical price chart
- Daily return chart
- Risk insight summary

The stock is classified into Low Risk, Medium Risk, or High Risk based on annualized volatility.

| Risk Level | Annualized Volatility | Meaning |
|---|---:|---|
| Low Risk | Below 20% | Smaller price movements |
| Medium Risk | 20% to 40% | Moderate price movements |
| High Risk | Above 40% | Larger price movements and higher uncertainty |

---

### Dynamic Stock Search

FinSight allows users to search by ticker, company name, or similar company name.

Examples:

- AAPL
- Apple
- TSLA
- Tesla
- MSFT
- Microsoft

This helps beginner users who may not know the exact stock ticker.

---

### Analysis Period Selection

Users can select different analysis periods:

- 6 Months
- 1 Year
- 3 Years
- 5 Years

The selected period is used for stock analysis, stock comparison, watchlist refresh, and risk calculation.

---

### Stock Risk Insight Summary

After analysing a stock, FinSight provides a simple explanation of the result, including:

- Risk level explanation
- Return explanation
- Volatility explanation
- Suitability notes based on user risk profile

This helps beginner users understand the meaning behind the financial metrics.

---

### Stock Comparison

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

---

### Watchlist

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
- Refresh watchlist button
- Risk distribution summary
- Compare from Watchlist feature

Guest users:

- Watchlist is saved in browser localStorage
- Data remains only on the same browser/device

Logged-in users:

- Watchlist is saved in PostgreSQL database
- Data remains after refresh, logout, and login

---

### Watchlist Refresh

Users can refresh saved stocks to update:

- Latest price
- Risk level
- Annualized volatility
- Last updated time

This makes the watchlist more useful for monitoring saved stocks over time.

---

### Watchlist Risk Distribution

The Watchlist page includes a risk distribution summary showing how saved stocks are grouped by:

- Low Risk
- Medium Risk
- High Risk

This gives users a quick overview of their saved stock risk exposure.

---

### Compare from Watchlist

Users can select two saved stocks from the Watchlist page and send them directly to the Compare page.

This improves the user flow because users do not need to type the same stock tickers again.

---

### User Risk Profile

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
|---:|---|
| 7 - 16 | Conservative |
| 17 - 26 | Moderate |
| 27 - 35 | Aggressive |

Guest users:

- Risk profile answers and result are saved in browser localStorage

Logged-in users:

- Risk profile answers and result are saved in PostgreSQL database

---

### Suitability Analysis

FinSight compares the user's risk profile with the analysed stock's risk level to generate a simple suitability explanation.

Example:

```text
User Risk Profile: Conservative
Stock Risk Level: High Risk
Suitability Result: Not Highly Suitable
```

This feature helps users understand whether a stock's risk level generally matches their personal risk tolerance. It is for educational purposes only and does not provide investment advice.

---

### Analysis History

FinSight stores recent stock analysis records.

The History page includes:

- Recent analysed stocks
- Total search summary
- Low, Medium, and High Risk summary
- Search by ticker or company name
- Filter by risk level
- Analyse again button
- Clear history button

Guest users:

- Analysis history is saved locally in the browser

Logged-in users:

- Analysis history is saved in PostgreSQL database
- History remains available after refresh, logout, and login

---

### User Authentication

FinSight includes a login and registration system.

Authentication features include:

- Register account
- Login account
- JWT token authentication
- Protected user data routes
- Logout function
- Account status page

Logged-in users can save their watchlist, risk profile, and analysis history to the database.

---

### Account Page

The Account page shows the user's current account and storage status.

It displays:

- Guest Mode or Logged-in Mode
- User name when logged in
- Watchlist count
- Risk profile status
- Analysis history count
- Explanation of localStorage and database storage

---

### Theme Modes

FinSight supports three visual modes:

- Light Mode
- Dark Mode
- Eye Protection Mode

The selected theme is saved locally so the user's preference remains after refresh.

---

### Home Dashboard Highlights

After a user has analysed at least one stock, the Home page displays personalised dashboard highlights, including:

- Recent searches
- Watchlist stocks
- Risk profile status
- Default analysis period

For new users with no analysis history, the Home page remains simple and introductory.

---

### Recent Analysis Preview

After analysing stocks, the Home page shows a preview of the latest analysed stocks. Users can quickly review recent activity and access the full History page.

---

### PDF Risk Report

Users can download a professional PDF report for an analysed stock.

The PDF report includes:

- Executive summary
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
- Risk classification method
- Disclaimer

---

### Improved Error Messages

FinSight provides clearer error messages for common issues such as:

- Backend server not connected
- Empty stock input
- Stock not found
- Not enough data
- Invalid comparison input
- Same stock selected for comparison

The messages include suggestions to help users understand and solve the issue.

---

## Website Pages

| Page | Description |
|---|---|
| Home | Introduces FinSight and shows dashboard highlights |
| Analyze | Allows users to analyse individual stock risk |
| Compare | Allows users to compare two stocks side by side |
| Watchlist | Allows users to save, refresh, remove, filter, sort, and compare saved stocks |
| Risk Profile | Provides a questionnaire to classify user risk tolerance |
| History | Displays previous stock analysis records |
| Account | Shows login status and storage mode |
| About | Explains project overview, methodology, formulas, and disclaimer |
| Login | Allows registered users to log in |
| Register | Allows new users to create an account |

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Recharts
- jsPDF
- CSS

### Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic
- JWT Authentication
- passlib bcrypt
- yfinance

### Database

- SQLite for local development
- PostgreSQL for deployed database on Render

### Deployment

- Frontend deployed on Vercel
- Backend deployed on Render
- PostgreSQL database hosted on Render

---

## System Architecture

```text
User
 |
 | interacts with
 v
React Frontend - Vercel
 |
 | API requests
 v
FastAPI Backend - Render
 |
 | database connection
 v
PostgreSQL Database - Render
```

---

## Data Storage Design

| User Type | Watchlist | Risk Profile | Analysis History |
|---|---|---|---|
| Guest User | localStorage | localStorage | localStorage |
| Logged-in User | PostgreSQL Database | PostgreSQL Database | PostgreSQL Database |

Guest mode allows users to try the system without creating an account.

Logged-in mode provides persistent storage because user data is linked to their account.

---

## Project Structure

```text
finsight-dashboard/
├── backend/
│   ├── auth.py
│   ├── auth_routes.py
│   ├── database.py
│   ├── history_routes.py
│   ├── main.py
│   ├── models.py
│   ├── risk_analysis.py
│   ├── risk_profile_routes.py
│   ├── schemas.py
│   ├── watchlist_routes.py
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
│   │   │   ├── AccountPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
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

---

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

---

## Stock Risk Classification

The system classifies stock risk based on annualized volatility.

| Annualized Volatility | Stock Risk Level |
|---|---|
| Less than 20% | Low Risk |
| 20% to 40% | Medium Risk |
| More than 40% | High Risk |

This classification is used to provide a simple risk interpretation for beginner users.

---

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

---

## API Endpoints

### Home Endpoint

```text
GET /
```

### Stock Analysis

```text
GET /analyze/{ticker}?period={period}
GET /search-stocks?query={searchText}
```

Supported periods:

| Period | Meaning |
|---|---|
| 6mo | 6 months |
| 1y | 1 year |
| 3y | 3 years |
| 5y | 5 years |

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/swagger-login
GET /auth/me
```

### User Watchlist

```text
GET /user/watchlist/
POST /user/watchlist/
DELETE /user/watchlist/{ticker}
DELETE /user/watchlist/
```

### User Risk Profile

```text
GET /user/risk-profile/
POST /user/risk-profile/
DELETE /user/risk-profile/
```

### User Analysis History

```text
GET /user/history/
POST /user/history/
DELETE /user/history/
```

---

## Local Installation

### 1. Clone the Repository

```bash
git clone https://github.com/HY0831/finsight-financial-risk-dashboard.git
cd finsight-financial-risk-dashboard
```

---

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend folder:

```env
DATABASE_URL=sqlite:///./finsight.db
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
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

---

## Frontend Setup

Open another terminal and go to the frontend folder:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the React development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173/
```

---

## Deployment Setup

### Backend on Render

Backend settings:

```text
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Render environment variables:

```env
DATABASE_URL=your-render-postgresql-url
JWT_SECRET_KEY=your-production-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend on Vercel

Frontend settings:

```text
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Vercel environment variable:

```env
VITE_API_BASE_URL=https://finsight-financial-risk-dashboard.onrender.com
```

---

## Screenshots

Screenshots are stored in the `screenshots` folder.

Suggested screenshots:

```text
home-page.png
analyze-page.png
stock-dashboard.png
stock-price-chart.png
compare-page.png
comparison-result.png
watchlist-page.png
risk-profile-page.png
risk-profile-result.png
history-page.png
account-page.png
about-page.png
login-page.png
register-page.png
dark-mode.png
eye-protection-mode.png
pdf-report.png
api-docs.png
```

Example:

```markdown
![Home Page](screenshots/home-page.png)
![Analyze Page](screenshots/analyze-page.png)
![Watchlist Page](screenshots/watchlist-page.png)
```

---

## Version History

| Version | Update |
|---|---|
| Version 1 | Initial stock risk analysis dashboard |
| Version 2 | Added user risk profile and suitability analysis |
| Version 3 | Added PDF risk report |
| Version 4 | Added stock comparison |
| Version 5 | Added recent search history |
| Version 6 | Refactored frontend into reusable React components |
| Version 7 | Improved UI and UX |
| Version 8 | Added dynamic stock search and improved PDF report |
| Version 9 | Converted project into multi-page website |
| Version 10 | Added Home dashboard personalisation |
| Version 11 | Added watchlist management |
| Version 12 | Added watchlist refresh and risk distribution |
| Version 13 | Added Compare from Watchlist |
| Version 14 | Improved About and History pages |
| Version 15 | Saved risk profile and improved analysis insights |
| Version 16 | Improved error handling and comparison recommendation |
| Version 17 | Added Light, Dark, and Eye Protection theme modes |
| Version 18 | Added user authentication foundation |
| Version 19 | Added cloud watchlist storage |
| Version 20 | Added cloud risk profile storage |
| Version 21 | Added cloud analysis history storage |
| Version 22 | Configured PostgreSQL deployment database |
| Version 23 | Added account storage status page |

---

## Future Improvements

Possible future improvements include:

- Email verification
- Password reset function
- Portfolio-level risk score
- Portfolio weight calculation
- Watchlist PDF summary report
- More advanced financial indicators
- Sector and industry analysis
- AI-generated personalised explanation
- Benchmark comparison such as S&P 500
- Candlestick charts
- Alembic database migrations
- Unit testing and API testing
- Mobile app version

---

## Learning Outcomes

Through this project, I practised:

- Building a full-stack web application
- Creating backend APIs using FastAPI
- Fetching stock market data using yfinance
- Processing financial data using pandas and NumPy
- Calculating return and volatility
- Designing a dashboard using React and Recharts
- Creating a multi-page React application using React Router
- Creating a user risk profile questionnaire
- Creating JWT-based login and registration
- Connecting frontend user features to database APIs
- Using PostgreSQL for deployed user data storage
- Using browser localStorage for guest mode
- Generating PDF reports using jsPDF
- Refactoring React code into reusable components
- Improving UI and UX design for dashboard-based applications
- Handling user-friendly error messages
- Structuring a GitHub portfolio project
- Deploying frontend and backend services
- Combining computer science and finance concepts in one project

---

## Limitations

FinSight is designed for educational and portfolio demonstration purposes.

The analysis is based mainly on historical stock price data and volatility. It does not include full fundamental analysis, macroeconomic analysis, company financial statements, or real-time professional investment advice.

Users should not make investment decisions based only on this dashboard.

---

## Disclaimer

This project is developed for educational and portfolio purposes only.

FinSight does not provide financial advice, investment recommendations, trading instructions, or professional financial planning services. Users should not rely on this system as the only basis for making investment decisions.

Stock market data may be delayed, incomplete, or affected by third-party data availability. Users should verify information from official financial sources before making investment decisions.

---

## References

- FINRA. Know Your Risk Tolerance. Available at: https://www.finra.org/investors/investing/investing-basics/know-your-risk-tolerance
- Vanguard. Investor Questionnaire. Available at: https://investor.vanguard.com/tools-calculators/investor-questionnaire
- CIRO. Investor Questionnaire. Available at: https://www.ciro.ca
- Ameriprise. Investment Risk Tolerance Quiz. Available at: https://www.ameriprise.com/financial-goals-priorities/investing/investment-risk-tolerance-quiz
- Yahoo Finance data accessed using the yfinance Python library.

---

## Author

Developed by Tey Hui Yang

Bachelor of Computer Science, Taylor's University

Minor in Finance