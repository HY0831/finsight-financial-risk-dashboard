function SearchSection({
  ticker,
  setTicker,
  period,
  setPeriod,
  loading,
  analyzeStock,
  stockSuggestions = [],
  suggestionLoading = false,
  searchStockSuggestions = () => {},
  setStockSuggestions = () => {},
}) {
  const handleInputChange = (event) => {
    const value = event.target.value;
    setTicker(value);
    searchStockSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setTicker(suggestion.ticker);
    setStockSuggestions([]);
  };

  return (
    <section className="search-card">
      <div className="search-card-header">
        <h2>Search Stock Risk</h2>
        <p>
          Search by stock ticker, company name, or similar company name. Select
          a suggestion, then click Analyse.
        </p>
      </div>

      <div className="search-section">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search ticker or company, e.g. AAPL, Apple, Maybank"
            value={ticker}
            onChange={handleInputChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                analyzeStock();
              }
            }}
          />

          {(suggestionLoading || stockSuggestions.length > 0) && (
            <div className="suggestions-dropdown">
              {suggestionLoading && (
                <p className="suggestion-loading">Searching...</p>
              )}

              {!suggestionLoading &&
                stockSuggestions.map((suggestion) => (
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
          )}
        </div>

        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
        >
          <option value="6mo">6 Months</option>
          <option value="1y">1 Year</option>
          <option value="3y">3 Years</option>
          <option value="5y">5 Years</option>
        </select>

        <button type="button" onClick={analyzeStock} disabled={loading}>
          {loading ? "Analysing..." : "Analyse"}
        </button>
      </div>
    </section>
  );
}

export default SearchSection;