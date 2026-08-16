# FinSight: AI-Powered Financial Risk Dashboard

FinSight is a full-stack financial risk analysis dashboard that helps users understand stock and gold price risk using historical market data. The system converts financial market data into simple risk insights such as average daily return, daily volatility, annualized volatility, maximum drawdown, risk level, and price trend movement.

The project includes a web application and a mobile application. The web app provides a full dashboard experience, while the mobile app provides key FinSight features in a React Native Expo app.

FinSight includes stock risk analysis, stock comparison, dynamic stock search, watchlist management, user risk profile analysis, analysis history, gold price dashboard, PDF report generation, user authentication, and database-backed user storage.

FinSight supports both guest users and logged-in users. Guest users can try the system using local storage, while logged-in users can save their watchlist, risk profile, and analysis history to a PostgreSQL database.

---

## Live Demo

Frontend: https://finsight-financial-risk-dashboard-k.vercel.app/

Backend API: https://finsight-financial-risk-dashboard.onrender.com

Mobile App: Built with Expo React Native and connected to the same Render backend API.

---

## Project Purpose

The purpose of FinSight is to make financial risk analysis easier for beginner users to understand. Instead of only showing market prices, FinSight explains risk using simple metrics, charts, and beginner-friendly summaries.

This project was developed as a personal portfolio project to demonstrate skills in:

- Full-stack web development
- Mobile app development
- React frontend development
- React Native Expo development
- FastAPI backend development
- REST API development
- Database-backed user features
- JWT authentication
- Financial risk analysis
- Data processing
- Data visualization
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
- Maximum drawdown
- Stock risk level
- Historical price line chart
- Daily return line chart
- Risk insight summary

The stock is classified into Low Risk, Medium Risk, or High Risk based on annualized volatility.

| Risk Level | Annualized Volatility | Meaning |
|---|---:|---|
| Low Risk | Below 20% | Smaller price movements |
| Medium Risk | 20% to 40% | Moderate price movements |
| High Risk | Above 40% | Larger price movements and higher uncertainty |

---

### Maximum Drawdown Analysis

FinSight calculates maximum drawdown to show the largest peak-to-bottom loss during the selected period.

Maximum drawdown helps users understand downside risk, not only price movement. A larger negative value means the stock experienced a deeper loss from a previous high point.

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

Users can select different stock analysis periods:

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
- Maximum drawdown explanation
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
- Maximum drawdown
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

### Gold Price Dashboard

FinSight includes an independent Gold Price Dashboard page.

The Gold page uses Yahoo Finance ticker `GC=F`, which represents gold futures data. The page is designed to help users track gold price movement and understand gold-related risk metrics.

The Gold Price Dashboard includes:

- Latest gold futures price
- Daily price change
- Daily percentage change
- Historical gold price line chart
- Time range selection
- 1 Week, 1 Month, 3 Months, 1 Year, and 5 Years trend selection
- Highest price in the selected period
- Lowest price in the selected period
- Average price in the selected period
- Daily volatility
- Annualized volatility
- Maximum drawdown
- Beginner-friendly gold market insight

Gold is commonly viewed as a safe-haven asset. Its price may be affected by inflation expectations, interest rates, USD strength, central bank activity, and global uncertainty.

Important note: this feature uses gold futures data, not physical gold jewellery or local retail gold shop prices.

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

- Web watchlist is saved in browser localStorage
- Mobile watchlist is saved using AsyncStorage
- Data remains only on the same browser or device

Logged-in users:

- Watchlist is saved in PostgreSQL database
- Data remains after refresh, logout, and login
- Mobile app and web app can use the same backend user data

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

- Web risk profile answers and result are saved in browser localStorage
- Mobile risk profile answers and result are saved using AsyncStorage

Logged-in users:

- Risk profile answers and result are saved in PostgreSQL database
- Risk profile remains available after logout and login

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

- Web analysis history is saved locally in the browser
- Mobile analysis history is saved using AsyncStorage

Logged-in users:

- Analysis history is saved in PostgreSQL database
- History remains available after refresh, logout, and login
- Mobile app can save and load cloud history through protected API routes

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

- Guest Mode or Cloud Save On
- User name when logged in
- Watchlist count
- Risk profile status
- Analysis history count
- Backend API status
- Explanation of local storage and database storage

---

### Theme Modes

FinSight web supports three visual modes:

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
- Maximum drawdown
- Stock risk level
- Price trend chart
- Daily return chart
- User risk profile
- Suitability analysis
- Risk classification method
- Disclaimer

---

### Mobile App Version

FinSight also includes a mobile app built with Expo React Native.

The mobile app includes:

- Home overview screen
- Stock analysis screen
- Gold price dashboard screen
- Stock comparison screen
- Watchlist screen
- Risk profile questionnaire screen
- Analysis history screen
- Account screen
- Login and register function
- Local storage for guest users
- Cloud watchlist sync for logged-in users
- Cloud analysis history sync for logged-in users
- Cloud risk profile sync for logged-in users
- Simple mobile line charts using react-native-svg
- Backend API connection status

Mobile storage design:

| User Type | Watchlist | Risk Profile | Analysis History |
|---|---|---|---|
| Guest User | AsyncStorage | AsyncStorage | AsyncStorage |
| Logged-in User | PostgreSQL Database | PostgreSQL Database | PostgreSQL Database |

The mobile app uses the same FastAPI backend deployed on Render.

---

### Improved Error Messages

FinSight provides clearer error messages for common issues such as:

- Backend server not connected
- Empty stock input
- Stock not found
- Not enough data
- Invalid comparison input
- Same stock selected for comparison
- Gold price data loading error
- Login or registration error
- Cloud storage error
- Third-party market data rate limit

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
| Gold | Displays gold futures price, trend, volatility, and drawdown |
| Account | Shows login status, storage mode, and API status |
| About | Explains project overview, methodology, formulas, and disclaimer |
| Login | Allows registered users to log in |
| Register | Allows new users to create an account |

---

## Mobile App Screens

| Screen | Description |
|---|---|
| Home | Shows FinSight mobile overview and key features |
| Analyze | Allows users to analyse stock risk using backend API |
| Compare | Allows users to compare two stocks side by side |
| Gold | Displays gold futures price and risk metrics |
| Watchlist | Shows local or cloud saved stocks |
| Profile | Provides mobile risk profile questionnaire |
| History | Shows local or cloud analysis history |
| Account | Shows login, register, logout, API status, and storage mode |

---

## Tech Stack

### Web Frontend

- React
- Vite
- React Router
- Recharts
- jsPDF
- CSS

### Mobile Frontend

- Expo
- React Native
- React Navigation
- AsyncStorage
- react-native-svg

### Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic
- JWT Authentication
- passlib bcrypt
- yfinance
- requests
- pandas
- NumPy

### Database

- SQLite for local development
- PostgreSQL for deployed database on Render

### Deployment

- Web frontend deployed on Vercel
- Backend deployed on Render
- PostgreSQL database hosted on Render
- Mobile app developed and tested using Expo Go

---

## System Architecture

```text
User
 |
 | interacts with
 v
React Web Frontend - Vercel
 |
 | API requests
 v
FastAPI Backend - Render
 |
 | database connection
 v
PostgreSQL Database - Render
```

Mobile architecture:

```text
Mobile User
 |
 | interacts with
 v
Expo React Native Mobile App
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

| Platform | User Type | Watchlist | Risk Profile | Analysis History |
|---|---|---|---|---|
| Web | Guest User | localStorage | localStorage | localStorage |
| Web | Logged-in User | PostgreSQL Database | PostgreSQL Database | PostgreSQL Database |
| Mobile | Guest User | AsyncStorage | AsyncStorage | AsyncStorage |
| Mobile | Logged-in User | PostgreSQL Database | PostgreSQL Database | PostgreSQL Database |

Guest mode allows users to try the system without creating an account.

Logged-in mode provides persistent storage because user data is linked to their account.

---

## Market Data Source and Fallback Design

FinSight mainly uses Yahoo Finance data through the yfinance Python library.

For stock analysis, the backend also includes a fallback data source using Stooq for common US tickers. This fallback helps reduce the impact of Yahoo Finance rate limits on deployed cloud servers.

The backend flow is:

```text
1. Try to fetch stock data from Yahoo Finance using yfinance
2. If Yahoo Finance fails or is rate limited, use Stooq fallback data
3. Calculate risk metrics from the available historical price data
4. Return beginner-friendly risk results to web and mobile apps
```

This improves reliability for common US stocks such as AAPL, MSFT, TSLA, NVDA, GOOGL, and AMZN.

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
│   ├── public/
│   │   └── screenshots/
│   │
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
│   │   │   ├── GoldPage.jsx
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
├── mobile/
│   ├── src/
│   │   ├── api/
│   │   │   ├── authStorage.js
│   │   │   ├── finsightApi.js
│   │   │   ├── historyStorage.js
│   │   │   ├── riskProfileStorage.js
│   │   │   └── watchlistStorage.js
│   │   │
│   │   ├── components/
│   │   │   └── SimpleLineChart.js
│   │   │
│   │   ├── screens/
│   │   │   ├── AccountScreen.js
│   │   │   ├── AnalyzeScreen.js
│   │   │   ├── CompareScreen.js
│   │   │   ├── GoldScreen.js
│   │   │   ├── HistoryScreen.js
│   │   │   ├── HomeScreen.js
│   │   │   ├── RiskProfileScreen.js
│   │   │   └── WatchlistScreen.js
│   │   │
│   │   └── theme/
│   │       └── colors.js
│   │
│   ├── App.js
│   ├── app.json
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## Risk Calculation Method

FinSight uses historical closing price data to calculate stock return, volatility, and downside risk.

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

### Maximum Drawdown

```text
Maximum Drawdown = (Lowest price after peak - Previous peak price) / Previous peak price
```

In Python:

```python
data["running_max"] = data["Close"].cummax()
data["drawdown"] = (data["Close"] - data["running_max"]) / data["running_max"]
maximum_drawdown = data["drawdown"].min()
```

Maximum drawdown shows the largest loss from a previous high point to a later low point during the selected period.

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

### Health Check

```text
GET /health
```

### Debug Routes

```text
GET /debug/routes
```

### Stock Analysis

```text
GET /analyze/{ticker}?period={period}
GET /search-stocks?query={searchText}
```

Supported stock analysis periods:

| Period | Meaning |
|---|---|
| 6mo | 6 months |
| 1y | 1 year |
| 3y | 3 years |
| 5y | 5 years |

### Gold Price

```text
GET /gold-price?period={period}
```

Supported gold periods:

| Period | Meaning |
|---|---|
| 1w | 1 week |
| 1mo | 1 month |
| 3mo | 3 months |
| 1y | 1 year |
| 5y | 5 years |

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/swagger-login
GET /auth/me
```

### Watchlist

```text
GET /watchlist/
POST /watchlist/
DELETE /watchlist/{ticker}
```

### Risk Profile

```text
GET /risk-profile/
POST /risk-profile/
DELETE /risk-profile/
```

### Analysis History

```text
GET /history/
POST /history/
DELETE /history/
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

For Windows:

```bash
.venv\Scripts\activate
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

## Mobile App Setup

Go to the mobile folder:

```bash
cd mobile
```

Install mobile dependencies:

```bash
npm install
```

Install Expo-compatible native packages if needed:

```bash
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-svg
```

Create a `.env` file inside the mobile folder:

```env
EXPO_PUBLIC_API_BASE_URL=https://finsight-financial-risk-dashboard.onrender.com
```

Start the Expo development server:

```bash
npx expo start -c
```

The mobile app can be tested using:

- Expo Go on a physical device
- iOS Simulator
- Android Emulator

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

### Mobile App

The mobile app is developed using Expo. It currently connects to the deployed Render backend through:

```env
EXPO_PUBLIC_API_BASE_URL=https://finsight-financial-risk-dashboard.onrender.com
```

The mobile app is not yet published to the App Store or Google Play Store.

---

## Screenshots

Screenshots can be stored in:

```text
frontend/public/screenshots/
```

Suggested web screenshots:

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
gold-page.png
account-page.png
about-page.png
login-page.png
register-page.png
dark-mode.png
eye-protection-mode.png
pdf-report.png
api-docs.png
```

Suggested mobile screenshots:

```text
mobile-home.png
mobile-analyze.png
mobile-gold.png
mobile-compare.png
mobile-watchlist-cloud.png
mobile-profile-cloud.png
mobile-history-cloud.png
mobile-account.png
mobile-login.png
mobile-register.png
```

Example:

```markdown
![Home Page](frontend/public/screenshots/home-page.png)
![Analyze Page](frontend/public/screenshots/analyze-page.png)
![Gold Page](frontend/public/screenshots/gold-page.png)
![Watchlist Page](frontend/public/screenshots/watchlist-page.png)
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
| Version 24 | Added maximum drawdown risk metric |
| Version 25 | Added gold price dashboard |
| Version 26 | Refined minimalist UI and chart styling |
| Version 27 | Added Expo React Native mobile app foundation |
| Version 28 | Added mobile stock analysis and gold dashboard |
| Version 29 | Added mobile watchlist, risk profile, and history local storage |
| Version 30 | Added mobile login and registration |
| Version 31 | Added mobile cloud watchlist sync |
| Version 32 | Added mobile cloud analysis history sync |
| Version 33 | Added mobile cloud risk profile sync |
| Version 34 | Added Stooq fallback for stock analysis when Yahoo Finance is rate limited |

---

## Future Improvements

Possible future improvements include:

- Email verification
- Password reset function
- Portfolio-level risk score
- Portfolio weight calculation
- Watchlist PDF summary report
- Sharpe Ratio analysis
- Beta analysis
- More advanced financial indicators
- Sector and industry analysis
- AI-generated personalised explanation
- Benchmark comparison such as S&P 500
- Candlestick charts
- Alembic database migrations
- Unit testing and API testing
- Mobile app UI polish
- Mobile bottom tab icons
- Mobile app publishing preparation
- App Store and Google Play deployment

---

## Learning Outcomes

Through this project, I practised:

- Building a full-stack web application
- Building a mobile app using Expo React Native
- Creating backend APIs using FastAPI
- Fetching stock and gold futures market data using yfinance
- Adding fallback stock data using Stooq when Yahoo Finance is rate limited
- Processing financial data using pandas and NumPy
- Calculating return, volatility, annualized volatility, and maximum drawdown
- Designing a dashboard using React and Recharts
- Creating simple mobile line charts using react-native-svg
- Creating a multi-page React application using React Router
- Creating a mobile tab navigation system using React Navigation
- Creating a user risk profile questionnaire
- Creating JWT-based login and registration
- Connecting frontend and mobile user features to database APIs
- Using PostgreSQL for deployed user data storage
- Using browser localStorage for web guest mode
- Using AsyncStorage for mobile guest mode
- Generating PDF reports using jsPDF
- Refactoring code into reusable components
- Improving UI and UX design for dashboard-based applications
- Handling user-friendly error messages
- Structuring a GitHub portfolio project
- Deploying frontend and backend services
- Combining computer science and finance concepts in one project

---

## Limitations

FinSight is designed for educational and portfolio demonstration purposes.

The analysis is based mainly on historical market price data and volatility. It does not include full fundamental analysis, macroeconomic analysis, company financial statements, or real-time professional investment advice.

The Gold Price Dashboard uses gold futures data from Yahoo Finance ticker `GC=F`. It does not represent physical gold jewellery price, local gold shop price, or official spot gold trading price.

Stock data is mainly retrieved using yfinance. If Yahoo Finance is rate limited on the deployed backend, the system attempts to use Stooq fallback data for common US stocks. However, fallback data may not support every ticker or market.

The mobile app is currently a portfolio and development version tested using Expo. It is not yet published to public app stores.

Users should not make investment decisions based only on this dashboard.

---

## Disclaimer

This project is developed for educational and portfolio purposes only.

FinSight does not provide financial advice, investment recommendations, trading instructions, or professional financial planning services. Users should not rely on this system as the only basis for making investment decisions.

Stock and gold market data may be delayed, incomplete, or affected by third-party data availability. Users should verify information from official financial sources before making investment decisions.

---

## References

- FINRA. Know Your Risk Tolerance. Available at: https://www.finra.org/investors/investing/investing-basics/know-your-risk-tolerance
- Vanguard. Investor Questionnaire. Available at: https://investor.vanguard.com/tools-calculators/investor-questionnaire
- CIRO. Investor Questionnaire. Available at: https://www.ciro.ca
- Ameriprise. Investment Risk Tolerance Quiz. Available at: https://www.ameriprise.com/financial-goals-priorities/investing/investment-risk-tolerance-quiz
- Yahoo Finance data accessed using the yfinance Python library.
- Stooq historical market data is used as a fallback source for selected common US stocks when Yahoo Finance is unavailable or rate limited.

---

## Author

Developed by Tey Hui Yang

Bachelor of Computer Science, Taylor's University

Minor in Finance