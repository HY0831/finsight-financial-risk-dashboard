import ComparisonSection from "../components/ComparisonSection";

function ComparePage({
  compareTickerOne,
  setCompareTickerOne,
  compareTickerTwo,
  setCompareTickerTwo,
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
      <section className="page-header">
        <h1>Compare Two Stocks</h1>
        <p>
          Compare two companies using the same selected analysis period to see
          which stock has higher volatility and risk.
        </p>
      </section>

      <ComparisonSection
        compareTickerOne={compareTickerOne}
        setCompareTickerOne={setCompareTickerOne}
        compareTickerTwo={compareTickerTwo}
        setCompareTickerTwo={setCompareTickerTwo}
        compareStocks={compareStocks}
        comparisonLoading={comparisonLoading}
        comparisonError={comparisonError}
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