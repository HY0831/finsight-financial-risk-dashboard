function AboutPage() {
  return (
    <>
      <section className="page-header">
        <h1>About FinSight</h1>
        <p>
          FinSight is a full-stack financial risk dashboard built for
          educational and portfolio purposes.
        </p>
      </section>

      <section className="about-section">
        <div className="about-card">
          <h2>What FinSight Does</h2>
          <p>
            FinSight helps users understand stock risk by analysing historical
            stock prices, average daily return, daily volatility, and annualized
            volatility.
          </p>
        </div>

        <div className="about-card">
          <h2>Risk Classification</h2>
          <p>
            Stocks are classified as Low Risk, Medium Risk, or High Risk based
            on annualized volatility. This provides a simplified way for
            beginner users to understand market risk.
          </p>
        </div>

        <div className="about-card">
          <h2>Technology Used</h2>
          <p>
            This project uses React, Vite, FastAPI, Python, Pandas, NumPy,
            yfinance, Recharts, jsPDF, GitHub, Vercel, and Render.
          </p>
        </div>

        <div className="about-card">
          <h2>Disclaimer</h2>
          <p>
            FinSight does not provide financial advice, investment
            recommendations, trading instructions, or professional financial
            planning services. It is developed for educational and portfolio
            purposes only.
          </p>
        </div>
      </section>
    </>
  );
}

export default AboutPage;