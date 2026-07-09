function EmptyState() {
  return (
    <section className="empty-state">
      <h2>Start Your Stock Risk Analysis</h2>
      <p>
        Enter a stock ticker such as AAPL, TSLA, MSFT, NVDA, or KO to view
        risk metrics, volatility, stock price trends, and a beginner-friendly
        risk explanation.
      </p>

      <div className="empty-tips">
        <div>
          <strong>Example ticker</strong>
          <p>AAPL, TSLA, MSFT, NVDA, KO</p>
        </div>

        <div>
          <strong>What you will see</strong>
          <p>Return, volatility, risk level, charts, and report</p>
        </div>

        <div>
          <strong>Purpose</strong>
          <p>Educational stock risk analysis, not investment advice</p>
        </div>
      </div>
    </section>
  );
}

export default EmptyState;