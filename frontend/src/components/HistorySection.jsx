function HistorySection({
  searchHistory,
  analyseFromHistory,
  clearSearchHistory,
}) {
  if (searchHistory.length === 0) {
    return null;
  }

  return (
    <section className="history-section">
      <div className="history-header">
        <div>
          <h2>Recent Searches</h2>
          <p>Click a ticker to analyse it again using the saved period.</p>
        </div>

        <button className="clear-history-button" onClick={clearSearchHistory}>
          Clear History
        </button>
      </div>

      <div className="history-list">
        {searchHistory.map((item) => (
          <button
            className="history-item"
            key={`${item.ticker}-${item.searched_at}`}
            onClick={() => analyseFromHistory(item)}
          >
            <div className="history-company">
              <strong>{item.ticker}</strong>
              <p>{item.company_name}</p>
            </div>

            <div className="history-risk">
              <span
                className={`risk-badge small-badge ${item.risk_level
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {item.risk_level}
              </span>
            </div>

            <div className="history-metrics">
              <p>
                <span>Period</span>
                {item.period}
              </p>
              <p>
                <span>Latest Price</span>
                ${item.latest_price}
              </p>
            </div>

            <div className="history-time">
              <span>Last analysed</span>
              <p>{item.searched_at}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default HistorySection;