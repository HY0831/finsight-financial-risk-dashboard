import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "finsightMobileHistory";

export async function getHistory() {
  const savedHistory = await AsyncStorage.getItem(HISTORY_KEY);
  return savedHistory ? JSON.parse(savedHistory) : [];
}

export async function saveHistory(history) {
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export async function addToHistory(stockData, period) {
  const currentHistory = await getHistory();

  const newHistoryItem = {
    ticker: stockData.ticker,
    company_name: stockData.company_name,
    latest_price: stockData.latest_price,
    risk_level: stockData.risk_level,
    annualized_volatility: stockData.annualized_volatility,
    maximum_drawdown: stockData.maximum_drawdown,
    average_daily_return: stockData.average_daily_return,
    volatility: stockData.volatility,
    period,
    searched_at: new Date().toLocaleString(),
  };

  const filteredHistory = currentHistory.filter(
    (item) => item.ticker !== stockData.ticker
  );

  const updatedHistory = [newHistoryItem, ...filteredHistory].slice(0, 30);

  await saveHistory(updatedHistory);

  return updatedHistory;
}

export async function clearHistory() {
  await AsyncStorage.removeItem(HISTORY_KEY);
}