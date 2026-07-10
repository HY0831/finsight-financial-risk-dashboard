import SearchSection from "../components/SearchSection";
import StockDashboard from "../components/StockDashboard";
import EmptyState from "../components/EmptyState";

function AnalyzePage({
  ticker,
  setTicker,
  period,
  setPeriod,
  loading,
  error,
  stockData,
  analyzeStock,
  stockSuggestions,
  suggestionLoading,
  searchStockSuggestions,
  setStockSuggestions,
  formatPercent,
  generatePDFReport,
  userRiskProfile,
  suitabilityResult,
}) {
  return (
    <>
      <section className="page-header">
        <h1>Stock Risk Analysis</h1>
        <p>
          Search by ticker or company name to analyse stock return, volatility,
          and risk level.
        </p>
      </section>

      <SearchSection
        ticker={ticker}
        setTicker={setTicker}
        period={period}
        setPeriod={setPeriod}
        loading={loading}
        analyzeStock={analyzeStock}
        stockSuggestions={stockSuggestions}
        suggestionLoading={suggestionLoading}
        searchStockSuggestions={searchStockSuggestions}
        setStockSuggestions={setStockSuggestions}
      />

      {loading && <p className="message">Analysing stock data...</p>}
      {error && <p className="error">{error}</p>}

      {!stockData && !loading && <EmptyState />}

      <StockDashboard
        stockData={stockData}
        formatPercent={formatPercent}
        generatePDFReport={generatePDFReport}
        userRiskProfile={userRiskProfile}
        suitabilityResult={suitabilityResult}
      />
    </>
  );
}

export default AnalyzePage;