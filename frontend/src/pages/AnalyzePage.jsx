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
  watchlist,
  toggleWatchlist,
}) {
  return (
    <>
      <section className="analyze-hero">
        <div>
          <span className="page-tag">Stock Risk Analysis</span>
          <h1>Analyse Stock Risk Using Real Market Data</h1>
          <p>
            Search for a stock by ticker or company name. FinSight will calculate
            return, volatility, risk level, and generate a professional PDF risk
            report.
          </p>
        </div>
      </section>

      <section className="analyze-guide">
        <div className="guide-card">
          <span>01</span>
          <h3>Search Stock</h3>
          <p>Enter a ticker such as AAPL, TSLA, MSFT, or search by company name.</p>
        </div>

        <div className="guide-card">
          <span>02</span>
          <h3>Select Period</h3>
          <p>Choose 6 months, 1 year, 3 years, or 5 years for analysis.</p>
        </div>

        <div className="guide-card">
          <span>03</span>
          <h3>View Risk Result</h3>
          <p>Review price trend, daily return, volatility, and risk level.</p>
        </div>

        <div className="guide-card">
          <span>04</span>
          <h3>Export Report</h3>
          <p>Download a structured PDF report with charts and insights.</p>
        </div>
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

      {loading && (
        <section className="analysis-status-card">
          <div className="loading-spinner"></div>
          <div>
            <h3>Analysing stock data...</h3>
            <p>
              FinSight is retrieving historical prices and calculating risk
              metrics.
            </p>
          </div>
        </section>
      )}

      {error && (
        <section className="analysis-error-card">
          <h3>Unable to analyse stock</h3>
          <p>{error}</p>
        </section>
      )}

      {!stockData && !loading && !error && (
        <section className="analyze-empty-wrapper">
          <EmptyState />
        </section>
      )}

      <StockDashboard
        stockData={stockData}
        formatPercent={formatPercent}
        generatePDFReport={generatePDFReport}
        userRiskProfile={userRiskProfile}
        suitabilityResult={suitabilityResult}
        watchlist={watchlist}
        toggleWatchlist={toggleWatchlist}
      />
    </>
  );
}

export default AnalyzePage;