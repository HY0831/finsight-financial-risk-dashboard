import { useState } from "react";
import { useNavigate } from "react-router";

function HistoryPage({ searchHistory, analyseFromHistory, clearSearchHistory }) {
  const navigate = useNavigate();

  const [historySearchText, setHistorySearchText] = useState("");
  const [historyRiskFilter, setHistoryRiskFilter] = useState("All");

  const totalHistory = searchHistory.length;

  const lowRiskCount = searchHistory.filter(
    (item) => item.risk_level === "Low Risk"
  ).length;

  const mediumRiskCount = searchHistory.filter(
    (item) => item.risk_level === "Medium Risk"
  ).length;

  const highRiskCount = searchHistory.filter(
    (item) => item.risk_level === "High Risk"
  ).length;

  const filteredHistory = searchHistory.filter((item) => {
    const searchText = historySearchText.toLowerCase();

    const matchesSearch =
      item.ticker.toLowerCase().includes(searchText) ||
      item.company_name.toLowerCase().includes(searchText);

    const matchesRisk =
      historyRiskFilter === "All" || item.risk_level === historyRiskFilter;

    return matchesSearch && matchesRisk;
  });

  const formatPeriodLabel = (selectedPeriod) => {
    if (selectedPeriod === "6mo") {
      return "6 Months";
    }

    if (selectedPeriod === "1y") {
      return "1 Year";
    }

    if (selectedPeriod === "3y") {
      return "3 Years";
    }

    if (selectedPeriod === "5y") {
      return "5 Years";
    }

    return selectedPeriod || "N/A";
  };

  const handleAnalyseAgain = async (historyItem) => {
    await analyseFromHistory(historyItem);
    navigate("/analyze");
  };

  return (
    <>
      <section className="history-hero">
        <div>
          <span className="page-tag">Analysis History</span>
          <h1>Your Recent Stock Analysis</h1>
          <p>
            Review your recently analysed stocks, filter by risk level, and
            re-analyse previous stocks easily.
          </p>
        </div>
      </section>

      {searchHistory.length > 0 && (
        <section className="history-summary-grid">
          <div className="history-summary-card">
            <span>Total Searches</span>
            <strong>{totalHistory}</strong>
            <p>Stocks recently analysed in this browser.</p>
          </div>

          <div className="history-summary-card">
            <span>Low Risk</span>
            <strong>{lowRiskCount}</strong>
            <p>History records classified as Low Risk.</p>
          </div>

          <div className="history-summary-card">
            <span>Medium Risk</span>
            <strong>{mediumRiskCount}</strong>
            <p>History records classified as Medium Risk.</p>
          </div>

          <div className="history-summary-card">
            <span>High Risk</span>
            <strong>{highRiskCount}</strong>
            <p>History records classified as High Risk.</p>
          </div>
        </section>
      )}

      {searchHistory.length === 0 && (
        <section className="history-empty-card">
          <h3>No analysis history yet</h3>
          <p>
            Your analysed stocks will appear here after you search and analyse a
            stock on the Analyze page.
          </p>

          <button type="button" onClick={() => navigate("/analyze")}>
            Start Stock Analysis
          </button>
        </section>
      )}

      {searchHistory.length > 0 && (
        <section className="history-section">
          <div className="history-header">
            <div>
              <h2>Recent Searches</h2>
              <p>
                FinSight stores your recent analysis records locally in your
                browser.
              </p>
            </div>

            <button
              type="button"
              className="clear-history-button"
              onClick={clearSearchHistory}
            >
              Clear History
            </button>
          </div>

          <div className="history-controls">
            <div>
              <label>Search History</label>
              <input
                type="text"
                placeholder="Search ticker or company name"
                value={historySearchText}
                onChange={(event) => setHistorySearchText(event.target.value)}
              />
            </div>

            <div>
              <label>Filter by Risk Level</label>
              <select
                value={historyRiskFilter}
                onChange={(event) => setHistoryRiskFilter(event.target.value)}
              >
                <option value="All">All Risk Levels</option>
                <option value="Low Risk">Low Risk</option>
                <option value="Medium Risk">Medium Risk</option>
                <option value="High Risk">High Risk</option>
              </select>
            </div>
          </div>

          <div className="history-list">
            {filteredHistory.map((item) => (
              <div className="history-card" key={`${item.ticker}-${item.searched_at}`}>
                <div className="history-company">
                  <h3>{item.ticker}</h3>
                  <p>{item.company_name}</p>
                </div>

                <div className="history-detail">
                  <span>Risk Level</span>
                  <strong
                    className={`risk-text ${item.risk_level
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {item.risk_level}
                  </strong>
                </div>

                <div className="history-detail">
                  <span>Period</span>
                  <strong>{formatPeriodLabel(item.period)}</strong>
                </div>

                <div className="history-detail">
                  <span>Latest Price</span>
                  <strong>${item.latest_price}</strong>
                </div>

                <div className="history-detail">
                  <span>Searched At</span>
                  <strong>{item.searched_at}</strong>
                </div>

                <button
                  type="button"
                  className="history-analyse-button"
                  onClick={() => handleAnalyseAgain(item)}
                >
                  Analyse Again
                </button>
              </div>
            ))}
          </div>

          {filteredHistory.length === 0 && (
            <div className="history-filter-empty">
              <h3>No history records found</h3>
              <p>
                Try changing the search keyword or selecting another risk level.
              </p>
            </div>
          )}
        </section>
      )}
    </>
  );
}

export default HistoryPage;