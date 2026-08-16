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

export async function analyzeStock(ticker, period = "1y") {
  const response = await fetch(
    `${API_BASE_URL}/analyze/${ticker}?period=${period}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Unable to analyze stock."));
  }

  return data;
}

export async function getGoldPrice(period = "1y") {
  const response = await fetch(`${API_BASE_URL}/gold-price?period=${period}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Unable to load gold price."));
  }

  return data;
}

export async function checkApiHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Unable to connect to backend API."));
  }

  return data;
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Unable to register account."));
  }

  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Unable to login."));
  }

  return data;
}

export async function getCurrentUser(token) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Unable to load user."));
  }

  return data;
}