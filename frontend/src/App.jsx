import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

function App() {
  const [ticker, setTicker] = useState("");
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeStock = async () => {
    if (!ticker.trim()) {
      setError("Please enter a stock ticker.");
      return;
    }

    setLoading(true);
    setError("");
    setStockData(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/analyze/${ticker.toUpperCase()}`
      );

      if (!response.ok) {
        throw new Error("Stock ticker not found. Please try again.");
      }

      const data = await response.json();
      setStockData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <div className="app">
      <header className="hero">
        <h1>FinSight</h1>
        <p>AI-Powered Financial Risk Dashboard</p>
      </header>

      <section className="search-section">
        <input
          type="text"
          placeholder="Enter stock ticker, e.g. AAPL, TSLA, KO"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              analyzeStock();
            }
          }}
        />
        <button onClick={analyzeStock}>Analyse</button>
      </section>

      {loading && <p className="message">Analysing stock data...</p>}
      {error && <p className="error">{error}</p>}

      {stockData && (
        <main className="dashboard">
          <section className="stock-header">
            <div>
              <h2>{stockData.ticker}</h2>
              <p>Latest Price: ${stockData.latest_price}</p>
            </div>
            <span className={`risk-badge ${stockData.risk_level.toLowerCase().replace(" ", "-")}`}>
              {stockData.risk_level}
            </span>
          </section>

          <section className="cards">
            <div className="card">
              <h3>Average Daily Return</h3>
              <p>{formatPercent(stockData.average_daily_return)}</p>
            </div>

            <div className="card">
              <h3>Daily Volatility</h3>
              <p>{formatPercent(stockData.volatility)}</p>
            </div>

            <div className="card">
              <h3>Annualized Volatility</h3>
              <p>{formatPercent(stockData.annualized_volatility)}</p>
            </div>

            <div className="card">
              <h3>Price Range</h3>
              <p>
                ${stockData.lowest_price} - ${stockData.highest_price}
              </p>
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
                {stockData.price_data.slice(-10).reverse().map((item) => (
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
      )}
    </div>
  );
}

export default App;