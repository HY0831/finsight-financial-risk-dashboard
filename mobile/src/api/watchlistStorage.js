import AsyncStorage from "@react-native-async-storage/async-storage";

const WATCHLIST_KEY = "finsightMobileWatchlist";

export async function getWatchlist() {
  const savedWatchlist = await AsyncStorage.getItem(WATCHLIST_KEY);
  return savedWatchlist ? JSON.parse(savedWatchlist) : [];
}

export async function saveWatchlist(watchlist) {
  await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
}

export async function addToWatchlist(stockData) {
  const currentWatchlist = await getWatchlist();

  const alreadySaved = currentWatchlist.some(
    (item) => item.ticker === stockData.ticker
  );

  if (alreadySaved) {
    return currentWatchlist;
  }

  const newItem = {
    ticker: stockData.ticker,
    company_name: stockData.company_name,
    latest_price: stockData.latest_price,
    risk_level: stockData.risk_level,
    annualized_volatility: stockData.annualized_volatility,
    maximum_drawdown: stockData.maximum_drawdown,
    saved_at: new Date().toLocaleString(),
  };

  const updatedWatchlist = [newItem, ...currentWatchlist];

  await saveWatchlist(updatedWatchlist);

  return updatedWatchlist;
}

export async function removeFromWatchlist(ticker) {
  const currentWatchlist = await getWatchlist();

  const updatedWatchlist = currentWatchlist.filter(
    (item) => item.ticker !== ticker
  );

  await saveWatchlist(updatedWatchlist);

  return updatedWatchlist;
}

export async function clearWatchlist() {
  await AsyncStorage.removeItem(WATCHLIST_KEY);
}