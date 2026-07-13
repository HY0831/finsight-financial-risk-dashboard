import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import SuitabilitySection from "./SuitabilitySection";

function StockDashboard({
  stockData,
  formatPercent,
  generatePDFReport,
  userRiskProfile,
  suitabilityResult,
}) {
  if (!stockData) {
    return null;
  }

  return (
    <main className="dashboard">
      <section className = "dashboard-title">
        <h2>Stock Risk Analysis Result</h2>
        <p>
          The result below is calculated using historical closing price data and
          volatility-based risk classification.
        </p>
      </section>
      
      <section className="stock-header">
        <div>
          <h2>{stockData.ticker}</h2>
          <p className="company-name">{stockData.company_name}</p>
          <p>Period Analysed: {stockData.period}</p>
          <p>Latest Price: ${stockData.latest_price}</p>
        </div>

        <div className="stock-actions">
          <span
            className={`risk-badge ${stockData.risk_level
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {stockData.risk_level}
          </span>

          <button className="report-button" onClick={generatePDFReport}>
            Generate PDF Report
          </button>
        </div>
      </section>

      <section className="cards">
        <div className="card">
          <h3>Average Daily Return</h3>
          <p>{formatPercent(stockData.average_daily_return)}</p>
          <span>Average daily price change during the selected period.</span>
        </div>

        <div className="card">
          <h3>Daily Volatility</h3>
          <p>{formatPercent(stockData.volatility)}</p>
          <span>Measures how much the stock price moves each day.</span>
        </div>

        <div className="card">
          <h3>Annualized Volatility</h3>
          <p>{formatPercent(stockData.annualized_volatility)}</p>
          <span>Estimated yearly volatility based on daily returns.</span>
        </div>

        <div className="card">
          <h3>Price Range</h3>
          <p>
            ${stockData.lowest_price} - ${stockData.highest_price}
          </p>
          <span>Lowest and highest closing price in the selected period.</span>
        </div>
      </section>

      <section className= "metric-explanation-section">
        <div className="section-title metric-explanation-title">
          <h2>Understanding These Metrics</h2>
          <p>
              These explanations help users understand how FinSight measures stock risk using return and volatility.
          </p>
        </div>

        <div className="metric-explanation-grid">
          <div className="metric-explanation-card">
            <h3>Average Daily Return</h3>
            <p>
                Average Daily Return shows the average percentage change in the stock
                price per trading day. A positive value means the stock increased on
                average, while a negative value means it decreased on average during the
                selected period.
            </p>
          </div>

          <div className="metric-explanation-card">
            <h3>Daily Volatility</h3>
            <p>
                Daily Volatility shows how much the stock return usually changes from
                day to day. A higher daily volatility means the stock price moved more
                sharply in the short term.
            </p>
          </div>

          <div className="metric-explanation-card">
            <h3>Annualized Volatility</h3>
            <p>
                Annualized Volatility converts daily volatility into a yearly risk
                measure using around 252 trading days. This makes it easier to compare
                stock risk over a longer period.  Annualized Volatility estimates the yearly volatility of the stock based on its daily returns. It provides a standardized way to compare the risk of stocks with different price levels or time periods.
            </p>
          </div>

          <div className="metric-explanation-card">
            <h3>Risk Level</h3>
            <p>
                Risk level is classified based on annualized volatility. Below 20% is
                Low Risk, 20% to 40% is Medium Risk, and above 40% is High Risk.
            </p>
          </div>
        </div>
      </section>

      <section className="chart-section">
        <h3>Stock Price Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stockData.price_data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="close" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="chart-section">
        <h3>Daily Return Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stockData.price_data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="daily_return" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="summary-section">
        <h3>Risk Summary</h3>
        <p>{stockData.summary}</p>
      </section>

      <SuitabilitySection
        userRiskProfile={userRiskProfile}
        stockRiskLevel={stockData.risk_level}
        suitabilityResult={suitabilityResult}
      />

      <section className="table-section">
        <h3>Recent Historical Data</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Close Price</th>
              <th>Daily Return</th>
            </tr>
          </thead>
          <tbody>
            {stockData.price_data
              .slice(-10)
              .reverse()
              .map((item) => (
                <tr key={item.date}>
                  <td>{item.date}</td>
                  <td>${item.close}</td>
                  <td>{formatPercent(item.daily_return)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default StockDashboard;