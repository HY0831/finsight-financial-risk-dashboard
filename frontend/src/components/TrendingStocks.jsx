import { useEffect, useState } from "react";

const POPULAR_TICKERS = ["AAPL", "MSFT", "NVDA", "TSLA", "AMZN", "GOOGL", "META", "KO"];

function TrendingStocks({ apiBaseUrl }) {
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trendLoading, setTrendLoading] = useState(true);
  const [trendError, setTrendError] = useState("");

  useEffect(() => {
    const fetchTrendingStocks = async () => {
      setTrendLoading(true);
      setTrendError("");

      try {
        const stockRequests = POPULAR_TICKERS.map((ticker) =>
          fetch(`${apiBaseUrl}/analyze/${ticker}?period=6mo`).then((response) => {
            if (!response.ok) {
              return null;
            }
            return response.json();
          })
        );

        const results = await Promise.all(stockRequests);
        const validResults = results.filter((stock) => stock !== null);

        setTrendingStocks(validResults);
      } catch {
        setTrendError("Unable to load trending stocks at the moment.");
      } finally {
        setTrendLoading(false);
      }
    };

    fetchTrendingStocks();
  }, [apiBaseUrl]);

  useEffect(() => {
    if (trendingStocks.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((previousIndex) =>
        previousIndex === trendingStocks.length - 1 ? 0 : previousIndex + 1
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [trendingStocks]);

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const getVisibleStocks = () => {
    if (trendingStocks.length === 0) {
      return [];
    }

    const visibleStocks = [];

    for (let i = 0; i < 4; i++) {
      const stockIndex = (currentIndex + i) % trendingStocks.length;
      visibleStocks.push(trendingStocks[stockIndex]);
    }

    return visibleStocks;
  };

  const getRiskClassName = (riskLevel) => {
    return riskLevel.toLowerCase().replace(" ", "-");
  };

  if (trendLoading) {
    return (
      <section className="trending-section">
        <div className="trending-header">
          <h2>Popular Stock Trends</h2>
          <p>Loading popular stock movements...</p>
        </div>
      </section>
    );
  }

  if (trendError) {
    return (
      <section className="trending-section">
        <div className="trending-header">
          <h2>Popular Stock Trends</h2>
          <p>{trendError}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="trending-section">
      <div className="trending-header">
        <div>
          <h2>Popular Stock Trends</h2>
          <p>
            Auto-switching overview of selected popular stocks based on recent
            market data.
          </p>
        </div>

        <span className="live-badge">Auto Updated</span>
      </div>

      <div className="trending-grid">
        {getVisibleStocks().map((stock) => (
          <div className="trend-card" key={stock.ticker}>
            <div className="trend-card-top">
              <div>
                <h3>{stock.ticker}</h3>
                <p>{stock.company_name}</p>
              </div>

              <span className={`risk-badge small-badge ${getRiskClassName(stock.risk_level)}`}>
                {stock.risk_level}
              </span>
            </div>

            <div className="trend-price-row">
              <div>
                <span>Latest Price</span>
                <strong>${stock.latest_price}</strong>
              </div>

              <div>
                <span>Annualized Volatility</span>
                <strong>{formatPercent(stock.annualized_volatility)}</strong>
              </div>
            </div>

            <div className="trend-bar-wrapper">
              <div className="trend-bar-label">
                <span>Risk movement</span>
                <span>{formatPercent(stock.annualized_volatility)}</span>
              </div>

              <div className="trend-bar">
                <div
                  className={`trend-bar-fill ${getRiskClassName(stock.risk_level)}`}
                  style={{
                    width: `${Math.min(stock.annualized_volatility * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrendingStocks;