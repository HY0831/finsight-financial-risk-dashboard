const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "https://finsight-financial-risk-dashboard.onrender.com";

export async function analyzeStock(ticker, period = "1y") {
  const response = await fetch(
    `${API_BASE_URL}/analyze/${ticker}?period=${period}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Unable to analyze stock.");
  }

  return data;
}

export async function getGoldPrice(period = "1y") {
  const response = await fetch(`${API_BASE_URL}/gold-price?period=${period}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Unable to load gold price.");
  }

  return data;
}