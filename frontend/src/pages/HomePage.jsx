import { Link } from "react-router";
import TrendingStocks from "../components/TrendingStocks";

function HomePage({ apiBaseUrl }) {
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
    </>
  );
}

export default HomePage;