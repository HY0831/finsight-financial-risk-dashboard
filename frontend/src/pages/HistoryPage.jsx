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
      <section className="page-header">
        <h1>Recent Search History</h1>
        <p>
          View your recent stock searches and quickly re-open a previous stock
          analysis.
        </p>
      </section>

      <HistorySection
        searchHistory={searchHistory}
        analyseFromHistory={handleHistoryClick}
        clearSearchHistory={clearSearchHistory}
      />
    </>
  );
}

export default HistoryPage;