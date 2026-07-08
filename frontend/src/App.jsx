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
  const [period, setPeriod] = useState("1y");
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [riskAnswers, setRiskAnswers] = useState({});
  const [userRiskProfile, setUserRiskProfile] = useState(null);

 const riskQuestions = [
  {
    id: "q1",
    question: "What is your main investment objective?",
    options: [
      { text: "Preserve my money and avoid losses", score: 1 },
      { text: "Earn stable income with low risk", score: 2 },
      { text: "Balance income and growth", score: 3 },
      { text: "Grow my money over time", score: 4 },
      { text: "Maximise long-term growth, even with higher risk", score: 5 },
    ],
  },
  {
    id: "q2",
    question: "How long do you plan to keep your money invested?",
    options: [
      { text: "Less than 1 year", score: 1 },
      { text: "1 to 2 years", score: 2 },
      { text: "3 to 5 years", score: 3 },
      { text: "6 to 10 years", score: 4 },
      { text: "More than 10 years", score: 5 },
    ],
  },
  {
    id: "q3",
    question: "When do you expect to need most of this money?",
    options: [
      { text: "Very soon, within 1 year", score: 1 },
      { text: "Within 1 to 2 years", score: 2 },
      { text: "Within 3 to 5 years", score: 3 },
      { text: "After 6 to 10 years", score: 4 },
      { text: "More than 10 years from now", score: 5 },
    ],
  },
  {
    id: "q4",
    question: "How would you react if your investment value dropped by 20% in a short period?",
    options: [
      { text: "Sell immediately to avoid further loss", score: 1 },
      { text: "Sell part of it and reduce risk", score: 2 },
      { text: "Wait and monitor the situation", score: 3 },
      { text: "Hold because I understand markets can recover", score: 4 },
      { text: "Consider buying more if the investment still looks strong", score: 5 },
    ],
  },
  {
    id: "q5",
    question: "How much short-term price movement can you accept?",
    options: [
      { text: "Very small movement only", score: 1 },
      { text: "Small movement", score: 2 },
      { text: "Moderate movement", score: 3 },
      { text: "Large movement", score: 4 },
      { text: "Very large movement for higher potential return", score: 5 },
    ],
  },
  {
    id: "q6",
    question: "How familiar are you with stocks, ETFs, or investment products?",
    options: [
      { text: "Not familiar at all", score: 1 },
      { text: "Beginner knowledge", score: 2 },
      { text: "Some basic knowledge", score: 3 },
      { text: "Good understanding", score: 4 },
      { text: "Experienced and confident", score: 5 },
    ],
  },
  {
    id: "q7",
    question: "How stable is your current financial situation for investing?",
    options: [
      { text: "Not stable, I may need this money anytime", score: 1 },
      { text: "Slightly stable, but I still need high liquidity", score: 2 },
      { text: "Moderately stable", score: 3 },
      { text: "Stable with some emergency savings", score: 4 },
      { text: "Very stable with enough emergency savings", score: 5 },
    ],
  },
];

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
        `http://127.0.0.1:8000/analyze/${ticker.toUpperCase()}?period=${period}`
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

  const calculateRiskProfile = () => {
  if (Object.keys(riskAnswers).length < riskQuestions.length) {
    alert("Please answer all questions before calculating your risk profile.");
    return;
  }

  const totalScore = Object.values(riskAnswers).reduce(
    (sum, score) => sum + score,
    0
  );

  let profile = "";
  let description = "";

  if (totalScore <= 16) {
    profile = "Conservative";
    description =
      "You prefer stability and capital protection. You may be less comfortable with large price movements or short-term losses.";
  } else if (totalScore <= 26) {
    profile = "Moderate";
    description =
      "You are willing to accept some investment risk for potential growth, but you may still prefer a balanced approach.";
  } else {
    profile = "Aggressive";
    description =
      "You are willing to accept higher risk and larger price movements for the possibility of higher long-term returns.";
  }

  setUserRiskProfile({
    score: totalScore,
    profile,
    description,
  });
};

  return (
    <div className="app">
      <header className="hero">
        <h1>FinSight</h1>
        <p>AI-Powered Financial Risk Dashboard</p>
        <p className = "disclaimer">
          For educational purposes only. This dashboard does not provide investment advice.
        </p>
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
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="1mo">1 Month</option>
          <option value="3mo">3 Months</option>
          <option value="6mo">6 Months</option>
          <option value="1y">1 Year</option>
          <option value="2y">2 Years</option>
          <option value="3y">3 Years</option>
          <option value="5y">5 Years</option>
        </select>
        <button onClick={analyzeStock} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </section>

      {loading && <p className="message">Analysing stock data...</p>}
      {error && <p className="error">{error}</p>}

      <section className="risk-profile-section">
        <div className="section-title">
          <h2>User Risk Profile Questionnaire</h2>
          <p>
            Answer these questions to identify your investment risk tolerance.
            This simplified questionnaire considers common risk profiling factors such as
            investment objective, time horizon, investment experience, financial situation,
            and comfort with market volatility.
          </p>

          <p className="source-note">
            Questionnaire adapted for educational purposes based on common investor risk
            profiling factors discussed by FINRA, Vanguard, CIRO, and Ameriprise.
          </p>
        </div>

        <div className="question-list">
          {riskQuestions.map((item, index) => (
            <div className="question-card" key={item.id}>
              <h3>
                {index + 1}. {item.question}
              </h3>

            <div className="option-group">
              {item.options.map((option) => (
                <label className="option-item" key={option.text}>
                  <input
                    type="radio"
                    name={item.id}
                    value={option.score}
                    checked={riskAnswers[item.id] === option.score}
                    onChange={() =>
                      setRiskAnswers({
                        ...riskAnswers,
                        [item.id]: option.score,
                      })
                    }
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="profile-button" onClick={calculateRiskProfile}>
        Calculate My Risk Profile
      </button>

      {userRiskProfile && (
        <div className="profile-result">
          <h3>Your Risk Profile: {userRiskProfile.profile}</h3>
          <p>Total Score: {userRiskProfile.score} / 35</p>
          <p>{userRiskProfile.description}</p>
        </div>
      )}
    </section>

      {stockData && (
        <main className="dashboard">
          <section className="stock-header">
            <div>
              <h2>{stockData.ticker}</h2>
              <p className="company-name">{stockData.company_name}</p>
              <p>Period Analysed: {stockData.period}</p>
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