function ComparisonSection({
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
  compareSuggestionsOne = [],
  compareSuggestionsTwo = [],
  compareSuggestionLoadingOne = false,
  compareSuggestionLoadingTwo = false,
  searchCompareStockSuggestions = () => {},
  setCompareSuggestionsOne = () => {},
  setCompareSuggestionsTwo = () => {},
}) {
  const handleFirstInputChange = (event) => {
    const value = event.target.value;
    setCompareTickerOne(value);
    searchCompareStockSuggestions(value, 1);
  };

  const handleSecondInputChange = (event) => {
    const value = event.target.value;
    setCompareTickerTwo(value);
    searchCompareStockSuggestions(value, 2);
  };

  const handleFirstSuggestionClick = (suggestion) => {
    setCompareTickerOne(suggestion.ticker);
    setCompareSuggestionsOne([]);
  };

  const handleSecondSuggestionClick = (suggestion) => {
    setCompareTickerTwo(suggestion.ticker);
    setCompareSuggestionsTwo([]);
  };

  const renderSuggestionDropdown = (
    suggestions,
    isLoading,
    handleSuggestionClick
  ) => {
    if (!isLoading && suggestions.length === 0) {
      return null;
    }

    return (
      <div className="compare-suggestions-dropdown">
        {isLoading && <p className="suggestion-loading">Searching...</p>}

        {!isLoading &&
          suggestions.map((suggestion) => (
            <button
              type="button"
              className="suggestion-item"
              key={`${suggestion.ticker}-${suggestion.exchange}`}
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              <div>
                <strong>{suggestion.ticker}</strong>
                <span>{suggestion.name}</span>
              </div>

              <small>{suggestion.exchange}</small>
            </button>
          ))}
      </div>
    );
  };

  const renderComparisonCard = (stock) => {
    return (
      <div className="comparison-card">
        <div className="comparison-card-header">
          <div>
            <h3>{stock.ticker}</h3>
            <p>{stock.company_name}</p>
          </div>

          <span
            className={`risk-badge ${stock.risk_level
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {stock.risk_level}
          </span>
        </div>

        <div className="comparison-metrics">
          <div className="comparison-metric">
            <span>Latest Price</span>
            <strong>${stock.latest_price}</strong>
          </div>

          <div className="comparison-metric">
            <span>Average Daily Return</span>
            <strong>{formatPercent(stock.average_daily_return)}</strong>
          </div>

          <div className="comparison-metric">
            <span>Annualized Volatility</span>
            <strong>{formatPercent(stock.annualized_volatility)}</strong>
          </div>

          <div className="comparison-metric">
            <span>Risk Level</span>
            <strong>{stock.risk_level}</strong>
          </div>
        </div>
      </div>
    );
  };

  const renderComparisonInterpretation = () => {
    if (!comparisonData) {
      return null;
    }

    const stockOne = comparisonData.stockOne;
    const stockTwo = comparisonData.stockTwo;

    const stockOneVolatility = stockOne.annualized_volatility;
    const stockTwoVolatility = stockTwo.annualized_volatility;

    const stockOneReturn = stockOne.average_daily_return;
    const stockTwoReturn = stockTwo.average_daily_return;

    let riskierStock = stockOne;
    let moreStableStock = stockTwo;

    if (stockTwoVolatility > stockOneVolatility) {
      riskierStock = stockTwo;
      moreStableStock = stockOne;
    }

    let higherReturnStock = stockOne;

    if (stockTwoReturn > stockOneReturn) {
      higherReturnStock = stockTwo;
    }

    return (
      <div className="comparison-interpretation">
        <div className="comparison-interpretation-header">
          <span>Comparison Interpretation</span>
          <h3>What This Comparison Means</h3>
          <p>
            This explanation compares both stocks using annualized volatility
            and average daily return during the selected period.
          </p>
        </div>

        <div className="comparison-interpretation-grid">
          <div className="comparison-interpretation-card riskier">
            <h4>Riskier Stock</h4>
            <strong>{riskierStock.ticker}</strong>
            <p>
              {riskierStock.ticker} appears riskier because it has higher
              annualized volatility. This means its price moved more strongly
              during the selected period.
            </p>
          </div>

          <div className="comparison-interpretation-card stable">
            <h4>More Stable Stock</h4>
            <strong>{moreStableStock.ticker}</strong>
            <p>
              {moreStableStock.ticker} appears more stable because it has lower
              annualized volatility. This means its price movement was
              relatively smaller during the selected period.
            </p>
          </div>

          <div className="comparison-interpretation-card return">
            <h4>Higher Average Daily Return</h4>
            <strong>{higherReturnStock.ticker}</strong>
            <p>
              {higherReturnStock.ticker} has the higher average daily return in
              this comparison. However, a higher return does not always mean a
              better investment because risk should also be considered.
            </p>
          </div>
        </div>

        <div className="comparison-interpretation-note">
          <strong>Important Note:</strong> This comparison is based only on
          historical return and volatility. It does not predict future
          performance and should not be treated as financial advice.
        </div>
      </div>
    );
  };

  const getComparisonRecommendation = () => {
    if (!comparisonData) {
      return null;
    }

    const stockOne = comparisonData.stockOne;
    const stockTwo = comparisonData.stockTwo;

    const stockOneVolatility = stockOne.annualized_volatility;
    const stockTwoVolatility = stockTwo.annualized_volatility;

    const lowerRiskStock =
      stockOneVolatility <= stockTwoVolatility ? stockOne : stockTwo;

    const higherRiskStock =
      stockOneVolatility > stockTwoVolatility ? stockOne : stockTwo;

    const betterReturnStock =
      stockOne.average_daily_return >= stockTwo.average_daily_return
        ? stockOne
        : stockTwo;

    let summary = "";

    if (stockOneVolatility === stockTwoVolatility) {
      summary = `${stockOne.ticker} and ${stockTwo.ticker} have similar annualized volatility. Users may compare their return, price trend, and business background before making further judgement.`;
    } else {
      summary = `${lowerRiskStock.ticker} has lower annualized volatility than ${higherRiskStock.ticker}, so it showed smaller price movement during the selected period. ${higherRiskStock.ticker} had higher volatility, which means it may involve higher uncertainty.`;
    }

    return {
      lowerRiskStock,
      higherRiskStock,
      betterReturnStock,
      summary,
    };
  };

  const comparisonRecommendation = getComparisonRecommendation();

  return (
    <section className="comparison-section">
      <div className="section-title comparison-title">
        <h2>Compare Two Stocks</h2>
        <p>
          Search by ticker or company name to compare two companies using the
          same selected analysis period.
        </p>
      </div>

      <div className="comparison-inputs">
        <div className="compare-input-wrapper">
          <input
            type="text"
            placeholder="First stock, e.g. AAPL or Apple"
            value={compareTickerOne}
            onChange={handleFirstInputChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                compareStocks();
              }
            }}
          />

          {renderSuggestionDropdown(
            compareSuggestionsOne,
            compareSuggestionLoadingOne,
            handleFirstSuggestionClick
          )}
        </div>

        <div className="compare-input-wrapper">
          <input
            type="text"
            placeholder="Second stock, e.g. TSLA or Tesla"
            value={compareTickerTwo}
            onChange={handleSecondInputChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                compareStocks();
              }
            }}
          />

          {renderSuggestionDropdown(
            compareSuggestionsTwo,
            compareSuggestionLoadingTwo,
            handleSecondSuggestionClick
          )}
        </div>

        <select
          className="compare-period-select"
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
        >
          <option value="6mo">6 Months</option>
          <option value="1y">1 Year</option>
          <option value="3y">3 Years</option>
          <option value="5y">5 Years</option>
        </select>

        <button type="button" onClick={compareStocks} disabled={comparisonLoading}>
          {comparisonLoading ? "Comparing..." : "Compare"}
        </button>
      </div>

      {comparisonError && <p className="error">{comparisonError}</p>}

      {comparisonData && (
        <>
          <div className="comparison-result">
            {renderComparisonCard(comparisonData.stockOne)}
            {renderComparisonCard(comparisonData.stockTwo)}

            <div className="comparison-summary">
              <div>
                <span>Comparison Insight</span>
                <h3>Volatility Comparison</h3>
              </div>

              <p>{comparisonData.summary}</p>
            </div>
          </div>

          {renderComparisonInterpretation()}
        </>
      )}

      {comparisonData && comparisonRecommendation && (
        <section className="comparison-recommendation-section">
          <div className="section-heading">
            <h2>Comparison Recommendation Summary</h2>
            <p>
              FinSight summarises the comparison result to help users understand which
              stock showed lower risk, higher risk, and stronger average return.
            </p>
          </div>

          <div className="comparison-recommendation-grid">
            <div className="comparison-recommendation-card">
              <span>Lower Risk Stock</span>
              <strong>{comparisonRecommendation.lowerRiskStock.ticker}</strong>
              <p>
                Lower annualized volatility at{" "}
                {formatPercent(
                  comparisonRecommendation.lowerRiskStock.annualized_volatility
                )}
                .
              </p>
            </div>

            <div className="comparison-recommendation-card">
              <span>Higher Risk Stock</span>
              <strong>{comparisonRecommendation.higherRiskStock.ticker}</strong>
              <p>
                Higher annualized volatility at{" "}
                {formatPercent(
                  comparisonRecommendation.higherRiskStock.annualized_volatility
                )}
                .
              </p>
            </div>

            <div className="comparison-recommendation-card">
              <span>Higher Average Return</span>
              <strong>{comparisonRecommendation.betterReturnStock.ticker}</strong>
              <p>
                Average daily return of{" "}
                {formatPercent(
                  comparisonRecommendation.betterReturnStock.average_daily_return
                )}
                .
              </p>
            </div>

            <div className="comparison-recommendation-card">
              <span>Conservative User View</span>
              <strong>{comparisonRecommendation.lowerRiskStock.ticker}</strong>
              <p>
                This stock may be more suitable for users who prefer smaller price
                movements.
              </p>
            </div>
          </div>

          <div className="comparison-recommendation-insight">
            <h3>Overall Insight</h3>
            <p>{comparisonRecommendation.summary}</p>
          </div>
        </section>
      )}
    </section>
  );
}

export default ComparisonSection;