import { Link } from "react-router";
import TrendingStocks from "../components/TrendingStocks";

function HomePage({
  apiBaseUrl,
  searchHistory = [],
  watchlist = [],
  userRiskProfile,
  period,
}) {
  const hasUserAnalysed = searchHistory.length > 0;

  const formatPeriodLabel = (selectedPeriod) => {
    if (selectedPeriod === "6mo") {
      return "6 Months";
    }

    if (selectedPeriod === "1y") {
      return "1 Year";
    }

    if (selectedPeriod === "3y") {
      return "3 Years";
    }

    if (selectedPeriod === "5y") {
      return "5 Years";
    }

    return selectedPeriod || "1 Year";
  };

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-tag">Financial Risk Dashboard</span>

          <h1>Understand Stock Risk with FinSight</h1>

          <p>
            Analyse stock volatility, compare companies, understand your risk
            profile, and generate a professional financial risk report.
          </p>

          <div className="home-actions">
            <Link to="/analyze" className="primary-link-button">
              Start Analysis
            </Link>

            <Link to="/compare" className="secondary-link-button">
              Compare Stocks
            </Link>
          </div>
        </div>
      </section>

      <TrendingStocks apiBaseUrl={apiBaseUrl} />

      {hasUserAnalysed && (
        <section className="dashboard-highlight-section">
          <div className="section-heading">
            <h2>Your FinSight Dashboard Highlights</h2>
            <p>
              A quick overview of your recent analysis activity, saved stocks,
              and risk profile status.
            </p>
          </div>

          <div className="dashboard-highlight-grid">
            <div className="dashboard-highlight-card">
              <span>Recent Searches</span>
              <strong>{searchHistory.length}</strong>
              <p>Stocks recently analysed in this browser.</p>
            </div>

            <div className="dashboard-highlight-card">
              <span>Watchlist Stocks</span>
              <strong>{watchlist.length}</strong>
              <p>Stocks saved for future monitoring.</p>
            </div>

            <div className="dashboard-highlight-card">
              <span>Risk Profile</span>
              <strong>{userRiskProfile ? "Completed" : "Not Set"}</strong>
              <p>
                {userRiskProfile
                  ? `${userRiskProfile.profile} investor profile.`
                  : "Complete the questionnaire for suitability insights."}
              </p>
            </div>

            <div className="dashboard-highlight-card">
              <span>Default Period</span>
              <strong>{formatPeriodLabel(period)}</strong>
              <p>Selected period used for stock analysis.</p>
            </div>
          </div>
        </section>
      )}

      <section className="how-section">
        <div className="section-heading">
          <h2>How FinSight Works</h2>
          <p>
            FinSight turns historical stock data into simple risk insights that
            are easier for beginner users to understand.
          </p>
        </div>

        <div className="how-grid">
          <div className="how-card">
            <span>01</span>
            <h3>Search a Stock</h3>
            <p>
              Enter a ticker or company name. FinSight retrieves historical stock
              data from the backend.
            </p>
          </div>

          <div className="how-card">
            <span>02</span>
            <h3>Calculate Risk Metrics</h3>
            <p>
              The system calculates average daily return, daily volatility, and
              annualized volatility.
            </p>
          </div>

          <div className="how-card">
            <span>03</span>
            <h3>Classify Risk Level</h3>
            <p>
              Stocks are classified as Low, Medium, or High Risk based on
              annualized volatility.
            </p>
          </div>

          <div className="how-card">
            <span>04</span>
            <h3>Generate Report</h3>
            <p>
              Users can download a structured PDF report with charts, metrics,
              insights, and suitability notes.
            </p>
          </div>
        </div>
      </section>

      <section className="risk-preview-section">
        <div className="section-heading">
          <h2>Risk Classification Method</h2>
          <p>
            FinSight uses annualized volatility to provide a simple stock risk
            classification.
          </p>
        </div>

        <div className="risk-preview-grid">
          <div className="risk-preview-card low">
            <h3>Low Risk</h3>
            <strong>&lt; 20%</strong>
            <p>
              Lower annualized volatility. The stock shows smaller price
              movements during the selected period.
            </p>
          </div>

          <div className="risk-preview-card medium">
            <h3>Medium Risk</h3>
            <strong>20% - 40%</strong>
            <p>
              Moderate annualized volatility. The stock has noticeable but not
              extreme price movement.
            </p>
          </div>

          <div className="risk-preview-card high">
            <h3>High Risk</h3>
            <strong>&gt; 40%</strong>
            <p>
              Higher annualized volatility. The stock shows larger price
              movements and higher uncertainty.
            </p>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="feature-card">
          <h3>Stock Risk Analysis</h3>
          <p>
            Search by ticker or company name and analyse return, volatility, and
            risk level.
          </p>
        </div>

        <div className="feature-card">
          <h3>Stock Comparison</h3>
          <p>
            Compare two stocks side by side using the same selected analysis
            period.
          </p>
        </div>

        <div className="feature-card">
          <h3>User Risk Profile</h3>
          <p>
            Understand whether your investment style is Conservative, Moderate,
            or Aggressive.
          </p>
        </div>

        <div className="feature-card">
          <h3>PDF Risk Report</h3>
          <p>
            Generate a colourful and structured report with charts, metrics, and
            insights.
          </p>
        </div>
      </section>

      <section className="home-cta">
        <h2>Ready to analyse your first stock?</h2>
        <p>
          Start with a popular stock such as AAPL, TSLA, MSFT, NVDA, or search by
          company name.
        </p>

        <Link to="/analyze" className="primary-link-button">
          Start Stock Analysis
        </Link>
      </section>
    </>
  );
}

export default HomePage;