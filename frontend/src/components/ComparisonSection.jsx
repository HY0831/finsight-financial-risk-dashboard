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
  return (
    <section className="comparison-section">
      <div className="section-title">
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
          <div className="comparison-card">
            <h3>{comparisonData.stockOne.ticker}</h3>
            <p className="company-name">{comparisonData.stockOne.company_name}</p>
            <p>Latest Price: ${comparisonData.stockOne.latest_price}</p>
            <p>
              Average Daily Return:{" "}
              {formatPercent(comparisonData.stockOne.average_daily_return)}
            </p>
            <p>
              Annualized Volatility:{" "}
              {formatPercent(comparisonData.stockOne.annualized_volatility)}
            </p>
            <span
              className={`risk-badge ${comparisonData.stockOne.risk_level
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {comparisonData.stockOne.risk_level}
            </span>
          </div>

          <div className="comparison-card">
            <h3>{comparisonData.stockTwo.ticker}</h3>
            <p className="company-name">{comparisonData.stockTwo.company_name}</p>
            <p>Latest Price: ${comparisonData.stockTwo.latest_price}</p>
            <p>
              Average Daily Return:{" "}
              {formatPercent(comparisonData.stockTwo.average_daily_return)}
            </p>
            <p>
              Annualized Volatility:{" "}
              {formatPercent(comparisonData.stockTwo.annualized_volatility)}
            </p>
            <span
              className={`risk-badge ${comparisonData.stockTwo.risk_level
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {comparisonData.stockTwo.risk_level}
            </span>
          </div>

          <div className="comparison-summary">
            <h3>Comparison Summary</h3>
            <p>{comparisonData.summary}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default ComparisonSection;