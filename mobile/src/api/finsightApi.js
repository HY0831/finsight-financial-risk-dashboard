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
  try {
    const cleanTicker = encodeURIComponent(ticker);
    const cleanPeriod = encodeURIComponent(period);

    const url = `${API_BASE_URL}/analyze/${cleanTicker}?period=${cleanPeriod}`;

    console.log("Analyze URL:", url);

    const response = await fetch(url);

    const text = await response.text();

    console.log("Analyze status:", response.status);
    console.log("Analyze raw response:", text);

    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new Error(`Backend returned non-JSON response: ${text}`);
    }

    if (!response.ok) {
      throw new Error(getErrorMessage(data, "Unable to analyze stock."));
    }

    return data;
  } catch (error) {
    console.log("analyzeStock API error:", error);
    throw new Error(error.message || "Unable to connect to stock analysis API.");
  }
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
  const url = `${API_BASE_URL}/watchlist/`;

  console.log("Cloud Watchlist URL:", url);
  console.log("Cloud Watchlist Token Exists:", Boolean(token));

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await response.text();

  console.log("Cloud Watchlist Status:", response.status);
  console.log("Cloud Watchlist Raw Response:", text);

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Backend returned non-JSON response: ${text}`);
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Unable to load cloud watchlist."));
  }

  return data;
}

export async function addCloudWatchlistItem(token, stockData) {
  const url = `${API_BASE_URL}/watchlist/`;

  console.log("Add Cloud Watchlist URL:", url);
  console.log("Add Cloud Watchlist Token Exists:", Boolean(token));

  const response = await fetch(url, {
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

  const text = await response.text();

  console.log("Add Cloud Watchlist Status:", response.status);
  console.log("Add Cloud Watchlist Raw Response:", text);

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Backend returned non-JSON response: ${text}`);
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Unable to save cloud watchlist item."));
  }

  return data;
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