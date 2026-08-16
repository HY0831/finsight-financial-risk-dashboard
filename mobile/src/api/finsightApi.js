const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "https://finsight-financial-risk-dashboard.onrender.com";

function getErrorMessage(data, fallbackMessage) {
  if (!data) {
    return fallbackMessage;
  }

  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data.detail)) {
    return data.detail
      .map((item) => {
        const field = Array.isArray(item.loc)
          ? item.loc[item.loc.length - 1]
          : "";

        if (item.msg && field) {
          return `${field}: ${item.msg}`;
        }

        if (item.msg) {
          return item.msg;
        }

        return JSON.stringify(item);
      })
      .join("\n");
  }

  if (typeof data.detail === "object") {
    return JSON.stringify(data.detail);
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  return fallbackMessage;
}

async function parseResponse(response, fallbackMessage) {
  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Backend returned non-JSON response: ${text}`);
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(data, fallbackMessage));
  }

  return data;
}

export async function analyzeStock(ticker, period = "1y") {
  const cleanTicker = encodeURIComponent(ticker);
  const cleanPeriod = encodeURIComponent(period);

  const response = await fetch(
    `${API_BASE_URL}/analyze/${cleanTicker}?period=${cleanPeriod}`
  );

  return await parseResponse(response, "Unable to analyze stock.");
}

export async function getGoldPrice(period = "1y") {
  const cleanPeriod = encodeURIComponent(period);

  const response = await fetch(`${API_BASE_URL}/gold-price?period=${cleanPeriod}`);

  return await parseResponse(response, "Unable to load gold price.");
}

export async function checkApiHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);

  return await parseResponse(response, "Unable to connect to backend API.");
}

export async function registerUser(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_name: name,
      username: name,
      name: name,
      email: email,
      password: password,
    }),
  });

  return await parseResponse(response, "Unable to register account.");
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  return await parseResponse(response, "Unable to login.");
}

export async function getCurrentUser(token) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await parseResponse(response, "Unable to load user.");
}

export async function getCloudWatchlist(token) {
  const response = await fetch(`${API_BASE_URL}/watchlist/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await parseResponse(response, "Unable to load cloud watchlist.");
}

export async function addCloudWatchlistItem(token, stockData) {
  const response = await fetch(`${API_BASE_URL}/watchlist/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ticker: stockData.ticker,
      company_name: stockData.company_name,
      latest_price: stockData.latest_price,
      risk_level: stockData.risk_level,
      annualized_volatility: stockData.annualized_volatility,
    }),
  });

  return await parseResponse(response, "Unable to save cloud watchlist item.");
}

export async function removeCloudWatchlistItem(token, ticker) {
  const cleanTicker = encodeURIComponent(ticker);

  const response = await fetch(`${API_BASE_URL}/watchlist/${cleanTicker}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await parseResponse(response, "Unable to remove cloud watchlist item.");
}

export async function getCloudHistory(token) {
  const response = await fetch(`${API_BASE_URL}/history/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await parseResponse(response, "Unable to load cloud history.");
}

export async function addCloudHistoryItem(token, stockData) {
  const response = await fetch(`${API_BASE_URL}/history/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ticker: stockData.ticker,
      company_name: stockData.company_name,
      latest_price: stockData.latest_price,
      risk_level: stockData.risk_level,
      annualized_volatility: stockData.annualized_volatility,
      maximum_drawdown: stockData.maximum_drawdown,
      average_daily_return: stockData.average_daily_return,
      volatility: stockData.volatility,
      period: stockData.period || "1y",
    }),
  });

  return await parseResponse(response, "Unable to save cloud history item.");
}

export async function clearCloudHistory(token) {
  const response = await fetch(`${API_BASE_URL}/history/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await parseResponse(response, "Unable to clear cloud history.");
}

export async function getCloudRiskProfile(token) {
  const response = await fetch(`${API_BASE_URL}/risk-profile/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await parseResponse(response, "Unable to load cloud risk profile.");
}

export async function saveCloudRiskProfile(token, profileData) {
  const response = await fetch(`${API_BASE_URL}/risk-profile/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      profile_type: profileData.profile,
      score: profileData.score,
      answers: profileData.answers || {},
    }),
  });

  return await parseResponse(response, "Unable to save cloud risk profile.");
}

export async function clearCloudRiskProfile(token) {
  const response = await fetch(`${API_BASE_URL}/risk-profile/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await parseResponse(response, "Unable to clear cloud risk profile.");
}