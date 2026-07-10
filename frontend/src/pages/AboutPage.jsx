function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div>
          <span className="page-tag">About FinSight</span>
          <h1>Built to Make Stock Risk Easier to Understand</h1>
          <p>
            FinSight is a full-stack financial risk dashboard that combines
            computer science, finance concepts, data analysis, and web
            development into one portfolio project.
          </p>
        </div>
      </section>

      <section className="about-overview-grid">
        <div className="about-overview-card">
          <span>01</span>
          <h3>Project Purpose</h3>
          <p>
            FinSight helps users understand stock risk using historical market
            data, volatility metrics, and simple risk classification.
          </p>
        </div>

        <div className="about-overview-card">
          <span>02</span>
          <h3>Target Users</h3>
          <p>
            The dashboard is designed for beginner investors, students, and
            users who want a simple explanation of stock risk.
          </p>
        </div>

        <div className="about-overview-card">
          <span>03</span>
          <h3>Portfolio Value</h3>
          <p>
            This project shows frontend development, backend API design, data
            processing, financial analysis, and PDF report generation.
          </p>
        </div>
      </section>

      <section className="about-detail-section">
        <div className="section-heading">
          <h2>What FinSight Does</h2>
          <p>
            FinSight converts stock price data into useful risk information that
            is easier to read and understand.
          </p>
        </div>

        <div className="about-detail-grid">
          <div className="about-detail-card">
            <h3>Stock Analysis</h3>
            <p>
              Users can search for a stock by ticker or company name. FinSight
              retrieves historical data and calculates return, volatility, and
              risk level.
            </p>
          </div>

          <div className="about-detail-card">
            <h3>Stock Comparison</h3>
            <p>
              Users can compare two stocks side by side using the same selected
              period to see which stock has higher volatility.
            </p>
          </div>

          <div className="about-detail-card">
            <h3>Risk Profile</h3>
            <p>
              Users can complete a questionnaire to estimate their investment
              risk profile and receive a suitability explanation.
            </p>
          </div>

          <div className="about-detail-card">
            <h3>PDF Report</h3>
            <p>
              FinSight can generate a structured PDF report with key metrics,
              charts, executive insights, suitability notes, and disclaimer.
            </p>
          </div>
        </div>
      </section>

      <section className="method-section">
        <div className="section-heading">
          <h2>Risk Classification Method</h2>
          <p>
            FinSight classifies stock risk using annualized volatility, which
            measures how much a stock price moves over time.
          </p>
        </div>

        <div className="method-grid">
          <div className="method-card low">
            <h3>Low Risk</h3>
            <strong>Below 20%</strong>
            <p>
              The stock has lower annualized volatility and smaller price
              movements during the selected period.
            </p>
          </div>

          <div className="method-card medium">
            <h3>Medium Risk</h3>
            <strong>20% to 40%</strong>
            <p>
              The stock has moderate annualized volatility and noticeable price
              movements.
            </p>
          </div>

          <div className="method-card high">
            <h3>High Risk</h3>
            <strong>Above 40%</strong>
            <p>
              The stock has higher annualized volatility and larger price
              movements.
            </p>
          </div>
        </div>
      </section>

      <section className="tech-section">
        <div className="section-heading">
          <h2>Technology Stack</h2>
          <p>
            FinSight is built using a modern frontend and backend structure.
          </p>
        </div>

        <div className="tech-grid">
          <div className="tech-card">
            <h3>Frontend</h3>
            <p>React, Vite, CSS, Recharts, jsPDF</p>
          </div>

          <div className="tech-card">
            <h3>Backend</h3>
            <p>Python, FastAPI, Pandas, NumPy, yfinance</p>
          </div>

          <div className="tech-card">
            <h3>Deployment</h3>
            <p>GitHub, Vercel, Render</p>
          </div>

          <div className="tech-card">
            <h3>Core Concepts</h3>
            <p>Financial risk, volatility, APIs, data analysis, reporting</p>
          </div>
        </div>
      </section>

      <section className="about-disclaimer-section">
        <h2>Important Disclaimer</h2>
        <p>
          FinSight is developed for educational and portfolio purposes only. It
          does not provide financial advice, investment recommendations, trading
          instructions, or professional financial planning services. Users should
          not rely on this dashboard as the only basis for making investment
          decisions.
        </p>
      </section>
    </>
  );
}

export default AboutPage;