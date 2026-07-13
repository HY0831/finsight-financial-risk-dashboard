import { useState } from "react";
import { useNavigate } from "react-router";

function WatchlistPage({ watchlist, toggleWatchlist, analyseFromWatchlist }) {
  const navigate = useNavigate();

  const [riskFilter, setRiskFilter] = useState("All");
  const [sortOption, setSortOption] = useState("latest");

  const totalSavedStocks = watchlist.length;

  const highRiskStocks = watchlist.filter(
    (item) => item.risk_level === "High Risk"
  ).length;

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

  return (
    <>
      <section className="watchlist-hero">
        <div>
          <span className="page-tag">Saved Stocks</span>
          <h1>Your Stock Watchlist</h1>
          <p>
            Save stocks that you want to monitor and quickly return to them for
            future risk analysis.
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
          <h3>Review Risk</h3>
          <p>
            View saved stocks with their latest analysed price, risk level, and
            volatility.
          </p>
        </div>

        <div className="watchlist-info-card">
          <span>03</span>
          <h3>Re-Analyse Anytime</h3>
          <p>
            Click Analyse Again to reload the stock and update the risk result.
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
                These stocks are stored locally in your browser using
                localStorage.
              </p>
            </div>
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
            {filteredWatchlist.map((item) => (
              <div className="watchlist-card" key={item.ticker}>
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
                </div>

                <div className="watchlist-actions">
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
            ))}
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