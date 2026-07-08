function SearchSection({
    ticker,
    setTicker,
    period,
    setPeriod,
    loading,
    analyzeStock,
}) {
    return (
      <section className="search-section">
        <input
          type="text"
          placeholder="Enter stock ticker, e.g. AAPL, TSLA, KO"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              analyzeStock();
            }
          }}
        />
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="1mo">1 Month</option>
          <option value="3mo">3 Months</option>
          <option value="6mo">6 Months</option>
          <option value="1y">1 Year</option>
          <option value="2y">2 Years</option>
          <option value="3y">3 Years</option>
          <option value="5y">5 Years</option>
        </select>
        <button onClick={analyzeStock} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </section>
    );
}

export default SearchSection;