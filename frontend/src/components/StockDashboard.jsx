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