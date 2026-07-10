import { useNavigate } from "react-router";
import HistorySection from "../components/HistorySection";

function HistoryPage({ searchHistory, analyseFromHistory, clearSearchHistory }) {
  const navigate = useNavigate();

  const handleHistoryClick = async (historyItem) => {
    await analyseFromHistory(historyItem);
    navigate("/analyze");
  };

  return (
    <>
      <section className="history-hero">
        <div>
          <span className="page-tag">Search History</span>
          <h1>Review Your Recent Stock Analysis</h1>
          <p>
            Quickly revisit your recent stock searches and continue analysing
            previous companies without typing the ticker again.
          </p>
        </div>
      </section>

      <section className="history-info-grid">
        <div className="history-info-card">
          <span>01</span>
          <h3>Recent Searches</h3>
          <p>
            FinSight stores your latest searched stocks locally in your browser.
          </p>
        </div>

        <div className="history-info-card">
          <span>02</span>
          <h3>Quick Re-Analyse</h3>
          <p>
            Click a previous search to reload the stock analysis with the same
            selected period.
          </p>
        </div>

        <div className="history-info-card">
          <span>03</span>
          <h3>Clear Anytime</h3>
          <p>
            You can remove your recent search history anytime using the clear
            button.
          </p>
        </div>
      </section>

      {searchHistory.length === 0 && (
        <section className="history-empty-card">
          <h3>No recent searches yet</h3>
          <p>
            Start by analysing a stock such as AAPL, TSLA, MSFT, NVDA, or search
            by company name.
          </p>

          <button type="button" onClick={() => navigate("/analyze")}>
            Start Stock Analysis
          </button>
        </section>
      )}

      {searchHistory.length > 0 && (
        <HistorySection
          searchHistory={searchHistory}
          analyseFromHistory={handleHistoryClick}
          clearSearchHistory={clearSearchHistory}
        />
      )}
    </>
  );
}

export default HistoryPage;