function ComparisonSection({
  compareTickerOne,
  setCompareTickerOne,
  compareTickerTwo,
  setCompareTickerTwo,
  compareStocks,
  comparisonLoading,
  comparisonError,
  comparisonData,
  formatPercent,
}) {
  const renderComparisonCard = (stock) => {
    return (
      <div className="comparison-card">
        <div className="comparison-card-header">
          <div>
            <h3>{stock.ticker}</h3>
            <p>{stock.company_name}</p>
          </div>

          <span
            className={`risk-badge ${stock.risk_level
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {stock.risk_level}
          </span>
        </div>

        <div className="comparison-metrics">
          <div className="comparison-metric">
            <span>Latest Price</span>
            <strong>${stock.latest_price}</strong>
          </div>

          <div className="comparison-metric">
            <span>Average Daily Return</span>
            <strong>{formatPercent(stock.average_daily_return)}</strong>
          </div>

          <div className="comparison-metric">
            <span>Annualized Volatility</span>
            <strong>{formatPercent(stock.annualized_volatility)}</strong>
          </div>

          <div className="comparison-metric">
            <span>Risk Level</span>
            <strong>{stock.risk_level}</strong>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="comparison-section">
      <div className="section-title comparison-title">
        <h2>Compare Two Stocks</h2>
        <p>
          Compare two companies using the same selected analysis period. This
          helps users understand which stock has higher volatility and risk.
        </p>
      </div>

      <div className="comparison-inputs">
        <input
          type="text"
          placeholder="First ticker, e.g. AAPL"
          value={compareTickerOne}
          onChange={(e) => setCompareTickerOne(e.target.value)}
        />

        <input
          type="text"
          placeholder="Second ticker, e.g. TSLA"
          value={compareTickerTwo}
          onChange={(e) => setCompareTickerTwo(e.target.value)}
        />

        <button onClick={compareStocks} disabled={comparisonLoading}>
          {comparisonLoading ? "Comparing..." : "Compare"}
        </button>
      </div>

      {comparisonError && <p className="error">{comparisonError}</p>}

      {comparisonData && (
        <div className="comparison-result">
          {renderComparisonCard(comparisonData.stockOne)}
          {renderComparisonCard(comparisonData.stockTwo)}

          <div className="comparison-summary">
            <div>
              <span>Comparison Insight</span>
              <h3>Volatility Comparison</h3>
            </div>
            <p>{comparisonData.summary}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default ComparisonSection;