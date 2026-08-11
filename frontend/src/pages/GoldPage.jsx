import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";

function GoldPage({ apiBaseUrl, formatPercent, theme }) {
  const [goldData, setGoldData] = useState(null);
  const [period, setPeriod] = useState("1y");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const periodOptions = [
    { label: "1 Week", value: "1w" },
    { label: "1 Month", value: "1mo" },
    { label: "3 Months", value: "3mo" },
    { label: "1 Year", value: "1y" },
    { label: "5 Years", value: "5y" },
  ];

  const fetchGoldPrice = async (selectedPeriod = period) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${apiBaseUrl}/gold-price?period=${selectedPeriod}`
      );

      if (!response.ok) {
        throw new Error("Unable to load gold price data.");
      }

      const data = await response.json();
      setGoldData(data);
    } catch (err) {
      setError(err.message || "Unable to load gold price data.");
      setGoldData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoldPrice(period);
  }, [period]);

  const formatMoney = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "N/A";
    }

    return `$${Number(value).toFixed(2)}`;
  };

  const priceChangeClass =
    goldData && goldData.price_change >= 0 ? "positive-change" : "negative-change";

const chartLineColor = theme === "dark" ? "#f9fafb" : "#111827";
const chartGridColor = theme === "dark" ? "#334155" : "#e5e7eb";
const chartTextColor = theme === "dark" ? "#cbd5e1" : "#6b7280";
  return (
    <>
      <section className="gold-hero">
        <div>
          <span className="page-tag">Gold Market</span>
          <h1>Gold Price Dashboard</h1>
          <p>
            Track active gold futures price, historical movement, trend data,
            volatility, and drawdown in one simple dashboard.
          </p>
        </div>
      </section>

      <section className="gold-control-section">
        <div>
          <h2>Gold Price Period</h2>
          <p>
            Select a time range to view gold price trend and related risk
            metrics.
          </p>
        </div>

        <div className="gold-period-select-wrapper">
            <label htmlFor="gold-period">Time Range</label>

            <select
                id="gold-period"
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
            >
                {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
                ))}
            </select>
        </div>
      </section>

      {loading && (
        <section className="analysis-status-card">
          <div className="loading-spinner"></div>
          <div>
            <h3>Loading Gold Data</h3>
            <p>Please wait while FinSight retrieves the latest gold data.</p>
          </div>
        </section>
      )}

      {error && (
        <section className="analysis-error-card">
          <div className="error-icon">!</div>
          <div>
            <h3>Unable to Load Gold Price</h3>
            <p>{error}</p>
            <span className="error-suggestion">
              Please check the backend server and try again.
            </span>
          </div>
        </section>
      )}

      {goldData && !loading && (
        <>
          <section className="gold-price-overview">
            <div className="gold-main-price-card">
              <span>{goldData.asset_name}</span>
              <h2>{formatMoney(goldData.latest_price)}</h2>
              <p className={priceChangeClass}>
                {goldData.price_change >= 0 ? "+" : ""}
                {formatMoney(goldData.price_change)} (
                {goldData.price_change_percent >= 0 ? "+" : ""}
                {formatPercent(goldData.price_change_percent)})
              </p>
              <small>Data source ticker: {goldData.ticker}</small>
            </div>

            <div className="gold-metric-card">
              <span>Highest Price</span>
              <strong>{formatMoney(goldData.highest_price)}</strong>
              <p>Highest closing price in the selected period.</p>
            </div>

            <div className="gold-metric-card">
              <span>Lowest Price</span>
              <strong>{formatMoney(goldData.lowest_price)}</strong>
              <p>Lowest closing price in the selected period.</p>
            </div>

            <div className="gold-metric-card">
              <span>Average Price</span>
              <strong>{formatMoney(goldData.average_price)}</strong>
              <p>Average closing price in the selected period.</p>
            </div>
          </section>

          <section className="gold-chart-section">
            <div className="section-heading">
              <h2>Historical Gold Price Trend</h2>
              <p>
                This chart shows the gold futures closing price movement for the
                selected period.
              </p>
            </div>

            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={goldData.price_data}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />

                <XAxis
                dataKey="date"
                minTickGap={28}
                tick={{ fill: chartTextColor, fontSize: 12 }}
                axisLine={{ stroke: chartGridColor }}
                tickLine={{ stroke: chartGridColor }}
                />

                <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: chartTextColor, fontSize: 12 }}
                axisLine={{ stroke: chartGridColor }}
                tickLine={{ stroke: chartGridColor }}
                />

                <Tooltip
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Close"]}
                contentStyle={{
                    backgroundColor: theme === "dark" ? "#111827" : "#ffffff",
                    borderColor: theme === "dark" ? "#334155" : "#e5e7eb",
                    color: theme === "dark" ? "#f9fafb" : "#111827",
                }}
                labelStyle={{
                    color: theme === "dark" ? "#f9fafb" : "#111827",
                }}
                />

                <Line
                type="monotone"
                dataKey="close"
                stroke={chartLineColor}
                strokeWidth={3}
                dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="gold-risk-section">
            <div className="section-heading">
              <h2>Gold Risk Metrics</h2>
              <p>
                These metrics help users understand gold price movement and
                downside risk.
              </p>
            </div>

            <div className="gold-risk-grid">
              <div className="gold-metric-card">
                <span>Daily Volatility</span>
                <strong>{formatPercent(goldData.volatility)}</strong>
                <p>Average short-term daily movement level.</p>
              </div>

              <div className="gold-metric-card">
                <span>Annualized Volatility</span>
                <strong>{formatPercent(goldData.annualized_volatility)}</strong>
                <p>Estimated yearly price movement level.</p>
              </div>

              <div className="gold-metric-card">
                <span>Maximum Drawdown</span>
                <strong>{formatPercent(goldData.maximum_drawdown)}</strong>
                <p>Largest peak-to-bottom drop in the selected period.</p>
              </div>
            </div>
          </section>

          <section className="gold-insight-section">
            <div className="section-heading">
              <h2>Gold Market Insight</h2>
              <p>{goldData.summary}</p>
            </div>

            <div className="gold-insight-grid">
              <div className="gold-insight-card">
                <h3>Why investors watch gold</h3>
                <p>
                  Gold is often used as a defensive asset when investors are
                  concerned about inflation, currency weakness, or market
                  uncertainty.
                </p>
              </div>

              <div className="gold-insight-card">
                <h3>What can affect gold price</h3>
                <p>
                  Gold price can be affected by interest rates, inflation,
                  central bank demand, USD strength, and global risk sentiment.
                </p>
              </div>

              <div className="gold-insight-card">
                <h3>Important note</h3>
                <p>
                  This page uses gold futures data, not physical gold jewellery
                  or local retail gold shop prices.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default GoldPage;