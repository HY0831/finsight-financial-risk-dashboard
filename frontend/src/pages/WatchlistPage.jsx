import { useNavigate } from "react-router";

function WatchlistPage({ watchlist, toggleWatchlist, analyseFromWatchlist }) {
  const navigate = useNavigate();

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

          <div className="watchlist-grid">
            {watchlist.map((item) => (
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
        </section>
      )}
    </>
  );
}

export default WatchlistPage;