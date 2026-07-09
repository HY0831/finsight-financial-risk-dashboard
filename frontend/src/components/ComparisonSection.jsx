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
  compareSuggestionsOne = [],
  compareSuggestionsTwo = [],
  compareSuggestionLoadingOne = false,
  compareSuggestionLoadingTwo = false,
  searchCompareStockSuggestions = () => {},
  setCompareSuggestionsOne = () => {},
  setCompareSuggestionsTwo = () => {},
}) {
  const handleFirstInputChange = (event) => {
    const value = event.target.value;
    setCompareTickerOne(value);
    searchCompareStockSuggestions(value, 1);
  };

  const handleSecondInputChange = (event) => {
    const value = event.target.value;
    setCompareTickerTwo(value);
    searchCompareStockSuggestions(value, 2);
  };

  const handleFirstSuggestionClick = (suggestion) => {
    setCompareTickerOne(suggestion.ticker);
    setCompareSuggestionsOne([]);
  };

  const handleSecondSuggestionClick = (suggestion) => {
    setCompareTickerTwo(suggestion.ticker);
    setCompareSuggestionsTwo([]);
  };

  const renderSuggestionDropdown = (
    suggestions,
    isLoading,
    handleSuggestionClick
  ) => {
    if (!isLoading && suggestions.length === 0) {
      return null;
    }

    return (
      <div className="compare-suggestions-dropdown">
        {isLoading && <p className="suggestion-loading">Searching...</p>}

        {!isLoading &&
          suggestions.map((suggestion) => (
            <button
              type="button"
              className="suggestion-item"
              key={`${suggestion.ticker}-${suggestion.exchange}`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div>
                <strong>{suggestion.ticker}</strong>
                <span>{suggestion.name}</span>
              </div>

              <small>{suggestion.exchange}</small>
            </button>
          ))}
      </div>
    );
  };

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
          Search by ticker or company name to compare two companies using the
          same selected analysis period.
        </p>
      </div>

      <div className="comparison-inputs">
        <div className="compare-input-wrapper">
          <input
            type="text"
            placeholder="First stock, e.g. AAPL or Apple"
            value={compareTickerOne}
            onChange={handleFirstInputChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                compareStocks();
              }
            }}
          />

          {renderSuggestionDropdown(
            compareSuggestionsOne,
            compareSuggestionLoadingOne,
            handleFirstSuggestionClick
          )}
        </div>

        <div className="compare-input-wrapper">
          <input
            type="text"
            placeholder="Second stock, e.g. TSLA or Tesla"
            value={compareTickerTwo}
            onChange={handleSecondInputChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                compareStocks();
              }
            }}
          />

          {renderSuggestionDropdown(
            compareSuggestionsTwo,
            compareSuggestionLoadingTwo,
            handleSecondSuggestionClick
          )}
        </div>

        <button type="button" onClick={compareStocks} disabled={comparisonLoading}>
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