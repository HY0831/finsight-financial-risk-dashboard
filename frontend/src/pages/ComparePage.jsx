import ComparisonSection from "../components/ComparisonSection";

function ComparePage({
  compareTickerOne,
  setCompareTickerOne,
  compareTickerTwo,
  setCompareTickerTwo,
  period,
  setPeriod,
  compareStocks,
  comparisonLoading,
  comparisonError,
  comparisonData,
  formatPercent,
  compareSuggestionsOne,
  compareSuggestionsTwo,
  compareSuggestionLoadingOne,
  compareSuggestionLoadingTwo,
  searchCompareStockSuggestions,
  setCompareSuggestionsOne,
  setCompareSuggestionsTwo,
}) {
  return (
    <>
      <section className="compare-hero">
        <div>
          <span className="page-tag">Stock Comparison</span>
          <h1>Compare Two Stocks Side by Side</h1>
          <p>
            Compare two companies using the same analysis period to understand
            which stock has higher volatility, stronger risk movement, and a
            different risk level.
          </p>
        </div>
      </section>

      <section className="compare-guide">
        <div className="guide-card">
          <span>01</span>
          <h3>Enter First Stock</h3>
          <p>
            Search by ticker or company name, then select the correct stock from
            the suggestion list.
          </p>
        </div>

        <div className="guide-card">
          <span>02</span>
          <h3>Enter Second Stock</h3>
          <p>
            Choose another company to compare against the first selected stock.
          </p>
        </div>

        <div className="guide-card">
          <span>03</span>
          <h3>Compare Risk</h3>
          <p>
            FinSight compares latest price, average daily return, annualized
            volatility, and risk level.
          </p>
        </div>
      </section>

      {comparisonLoading && (
        <section className="comparison-status-card">
          <div className="loading-spinner"></div>
          <div>
            <h3>Comparing stock data...</h3>
            <p>
              FinSight is retrieving both stocks and calculating their risk
              metrics.
            </p>
          </div>
        </section>
      )}

      {comparisonError && (
        <section className="comparison-error-card">
          <h3>Unable to compare stocks</h3>
          <p>{comparisonError}</p>
        </section>
      )}

      {!comparisonData && !comparisonLoading && !comparisonError && (
        <section className="compare-empty-card">
          <h3>Start by choosing two stocks</h3>
          <p>
            For example, compare AAPL with TSLA, MSFT with NVDA, or KO with PEP.
          </p>
        </section>
      )}

      <ComparisonSection
        compareTickerOne={compareTickerOne}
        setCompareTickerOne={setCompareTickerOne}
        compareTickerTwo={compareTickerTwo}
        setCompareTickerTwo={setCompareTickerTwo}
        period={period}
        setPeriod={setPeriod}
        compareStocks={compareStocks}
        comparisonLoading={comparisonLoading}
        comparisonError=""
        comparisonData={comparisonData}
        formatPercent={formatPercent}
        compareSuggestionsOne={compareSuggestionsOne}
        compareSuggestionsTwo={compareSuggestionsTwo}
        compareSuggestionLoadingOne={compareSuggestionLoadingOne}
        compareSuggestionLoadingTwo={compareSuggestionLoadingTwo}
        searchCompareStockSuggestions={searchCompareStockSuggestions}
        setCompareSuggestionsOne={setCompareSuggestionsOne}
        setCompareSuggestionsTwo={setCompareSuggestionsTwo}
      />
    </>
  );
}

export default ComparePage;