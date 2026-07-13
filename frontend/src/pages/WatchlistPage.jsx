import { useState } from "react";
import { useNavigate } from "react-router";

function WatchlistPage({
  watchlist,
  toggleWatchlist,
  analyseFromWatchlist,
  clearWatchlist,
  refreshWatchlist,
  setCompareTickerOne,
  setCompareTickerTwo,
  setComparisonData,
  setComparisonError,
}) {
  const navigate = useNavigate();

  const [riskFilter, setRiskFilter] = useState("All");
  const [sortOption, setSortOption] = useState("latest");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState([]);

  const totalSavedStocks = watchlist.length;

  const highRiskStocks = watchlist.filter(
    (item) => item.risk_level === "High Risk"
  ).length;

  const lowRiskStocks = watchlist.filter(
    (item) => item.risk_level === "Low Risk"
  ).length;

  const mediumRiskStocks = watchlist.filter(
    (item) => item.risk_level === "Medium Risk"
  ).length;

  const getRiskPercentage = (count) => {
    if (watchlist.length === 0) {
      return 0;
    }

    return (count / watchlist.length) * 100;
  };

  const averageWatchlistVolatility =
    watchlist.length > 0
      ? watchlist.reduce(
          (total, item) => total + item.annualized_volatility,
          0
        ) / watchlist.length
      : 0;

  const highestRiskStock =
    watchlist.length > 0
      ? watchlist.reduce((highest, current) =>
          current.annualized_volatility > highest.annualized_volatility
            ? current
            : highest
        )
      : null;

  const filteredWatchlist = [...watchlist]
    .filter((item) => {
      if (riskFilter === "All") {
        return true;
      }

      return item.risk_level === riskFilter;
    })
    .sort((a, b) => {
      if (sortOption === "highest-volatility") {
        return b.annualized_volatility - a.annualized_volatility;
      }

      if (sortOption === "lowest-volatility") {
        return a.annualized_volatility - b.annualized_volatility;
      }

      return 0;
    });

  const handleAnalyseStock = async (watchlistItem) => {
    await analyseFromWatchlist(watchlistItem);
    navigate("/analyze");
  };

  const handleRefreshWatchlist = async () => {
    setRefreshing(true);
    await refreshWatchlist();
    setRefreshing(false);
  };

  const toggleSelectedStock = (ticker) => {
    if (selectedStocks.includes(ticker)) {
      setSelectedStocks(selectedStocks.filter((item) => item !== ticker));
      return;
    }

    if (selectedStocks.length >= 2) {
      alert("You can only select two stocks for comparison.");
      return;
    }

    setSelectedStocks([...selectedStocks, ticker]);
  };

  const compareSelectedStocks = () => {
    if (selectedStocks.length !== 2) {
      alert("Please select exactly two stocks to compare.");
      return;
    }

    setCompareTickerOne(selectedStocks[0]);
    setCompareTickerTwo(selectedStocks[1]);
    setComparisonData(null);
    setComparisonError("");

    navigate("/compare");
  };

  return (
    <>
      <section className="watchlist-hero">
        <div>
          <span className="page-tag">Saved Stocks</span>
          <h1>Your Stock Watchlist</h1>
          <p>
            Save stocks that you want to monitor, refresh their latest risk data,
            and compare selected stocks from your saved list.
          </p>
        </div>
      </section>

      <section className="watchlist-info-grid">
        <div className="watchlist-info-card">
          <span>01</span>
          <h3>Save Stocks</h3>
          <p>
            Add stocks from the Analyze page after reviewing their risk result.
          </p>
        </div>

        <div className="watchlist-info-card">
          <span>02</span>
          <h3>Refresh Risk Data</h3>
          <p>
            Refresh saved stocks to update their latest price, risk level, and
            volatility.
          </p>
        </div>

        <div className="watchlist-info-card">
          <span>03</span>
          <h3>Compare Saved Stocks</h3>
          <p>
            Select two saved stocks and compare their risk levels side by side.
          </p>
        </div>
      </section>

      {watchlist.length > 0 && (
        <section className="watchlist-summary-grid">
          <div className="watchlist-summary-card">
            <span>Total Saved Stocks</span>
            <strong>{totalSavedStocks}</strong>
            <p>Stocks currently saved in your watchlist.</p>
          </div>

          <div className="watchlist-summary-card">
            <span>High Risk Stocks</span>
            <strong>{highRiskStocks}</strong>
            <p>Saved stocks classified as High Risk.</p>
          </div>

          <div className="watchlist-summary-card">
            <span>Average Volatility</span>
            <strong>{(averageWatchlistVolatility * 100).toFixed(2)}%</strong>
            <p>Average annualized volatility of saved stocks.</p>
          </div>

          <div className="watchlist-summary-card">
            <span>Highest Risk Stock</span>
            <strong>{highestRiskStock ? highestRiskStock.ticker : "N/A"}</strong>
            <p>
              {highestRiskStock
                ? "Stock with the highest annualized volatility."
                : "No stock available."}
            </p>
          </div>
        </section>
      )}

      {watchlist.length > 0 && (
        <section className="watchlist-risk-distribution">
          <div className="section-heading">
            <h2>Watchlist Risk Distribution</h2>
            <p>
              This shows how your saved stocks are distributed across Low,
              Medium, and High Risk categories.
            </p>
          </div>

          <div className="risk-distribution-list">
            <div className="risk-distribution-row">
              <div className="risk-distribution-label">
                <span className="risk-dot low"></span>
                <strong>Low Risk</strong>
              </div>

              <div className="risk-distribution-bar">
                <div
                  className="risk-distribution-fill low"
                  style={{ width: `${getRiskPercentage(lowRiskStocks)}%` }}
                ></div>
              </div>

              <span className="risk-distribution-count">{lowRiskStocks}</span>
            </div>

            <div className="risk-distribution-row">
              <div className="risk-distribution-label">
                <span className="risk-dot medium"></span>
                <strong>Medium Risk</strong>
              </div>

              <div className="risk-distribution-bar">
                <div
                  className="risk-distribution-fill medium"
                  style={{ width: `${getRiskPercentage(mediumRiskStocks)}%` }}
                ></div>
              </div>

              <span className="risk-distribution-count">
                {mediumRiskStocks}
              </span>
            </div>

            <div className="risk-distribution-row">
              <div className="risk-distribution-label">
                <span className="risk-dot high"></span>
                <strong>High Risk</strong>
              </div>

              <div className="risk-distribution-bar">
                <div
                  className="risk-distribution-fill high"
                  style={{ width: `${getRiskPercentage(highRiskStocks)}%` }}
                ></div>
              </div>

              <span className="risk-distribution-count">{highRiskStocks}</span>
            </div>
          </div>
        </section>
      )}

      {watchlist.length === 0 && (
        <section className="watchlist-empty-card">
          <h3>No stocks saved yet</h3>
          <p>
            Go to the Analyze page, search for a stock, and click Add to
            Watchlist.
          </p>

          <button type="button" onClick={() => navigate("/analyze")}>
            Start Stock Analysis
          </button>
        </section>
      )}

      {watchlist.length > 0 && (
        <section className="watchlist-section">
          <div className="watchlist-header">
            <div>
              <h2>Saved Stocks</h2>
              <p>
                Select two saved stocks to compare them, or refresh the saved
                data to update latest risk information.
              </p>
            </div>

            <div className="watchlist-header-actions">
              <button
                type="button"
                className="refresh-watchlist-button"
                onClick={handleRefreshWatchlist}
                disabled={refreshing}
              >
                {refreshing ? "Refreshing..." : "Refresh Data"}
              </button>

              <button
                type="button"
                className="clear-watchlist-button"
                onClick={clearWatchlist}
              >
                Clear Watchlist
              </button>
            </div>
          </div>

          <div className="watchlist-compare-panel">
            <div>
              <h3>Compare from Watchlist</h3>
              <p>
                Selected:{" "}
                {selectedStocks.length > 0
                  ? selectedStocks.join(" vs ")
                  : "No stocks selected"}
              </p>
            </div>

            <button
              type="button"
              className="compare-selected-button"
              onClick={compareSelectedStocks}
              disabled={selectedStocks.length !== 2}
            >
              Compare Selected
            </button>
          </div>

          <div className="watchlist-controls">
            <div>
              <label>Filter by Risk Level</label>
              <select
                value={riskFilter}
                onChange={(event) => setRiskFilter(event.target.value)}
              >
                <option value="All">All Stocks</option>
                <option value="Low Risk">Low Risk</option>
                <option value="Medium Risk">Medium Risk</option>
                <option value="High Risk">High Risk</option>
              </select>
            </div>

            <div>
              <label>Sort Watchlist</label>
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
              >
                <option value="latest">Latest Saved</option>
                <option value="highest-volatility">Highest Volatility</option>
                <option value="lowest-volatility">Lowest Volatility</option>
              </select>
            </div>
          </div>

          <div className="watchlist-grid">
            {filteredWatchlist.map((item) => {
              const isSelected = selectedStocks.includes(item.ticker);

              return (
                <div
                  className={`watchlist-card ${
                    isSelected ? "selected-watchlist-card" : ""
                  }`}
                  key={item.ticker}
                >
                  <div className="watchlist-card-header">
                    <div>
                      <h3>{item.ticker}</h3>
                      <p>{item.company_name}</p>
                    </div>

                    <span
                      className={`risk-badge small-badge ${item.risk_level
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {item.risk_level}
                    </span>
                  </div>

                  <div className="watchlist-metrics">
                    <div>
                      <span>Latest Price</span>
                      <strong>${item.latest_price}</strong>
                    </div>

                    <div>
                      <span>Annualized Volatility</span>
                      <strong>
                        {(item.annualized_volatility * 100).toFixed(2)}%
                      </strong>
                    </div>

                    <div>
                      <span>Saved At</span>
                      <strong>{item.saved_at}</strong>
                    </div>

                    <div>
                      <span>Last Updated</span>
                      <strong>{item.updated_at || "Not refreshed yet"}</strong>
                    </div>
                  </div>

                  <div className="watchlist-actions">
                    <button
                      type="button"
                      className={`watchlist-select-button ${
                        isSelected ? "selected" : ""
                      }`}
                      onClick={() => toggleSelectedStock(item.ticker)}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>

                    <button
                      type="button"
                      className="watchlist-analyse-button"
                      onClick={() => handleAnalyseStock(item)}
                    >
                      Analyse Again
                    </button>

                    <button
                      type="button"
                      className="watchlist-remove-button"
                      onClick={() => toggleWatchlist(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredWatchlist.length === 0 && (
            <div className="watchlist-filter-empty">
              <h3>No stocks match this filter</h3>
              <p>Try selecting another risk level or changing the sort option.</p>
            </div>
          )}
        </section>
      )}
    </>
  );
}

export default WatchlistPage;