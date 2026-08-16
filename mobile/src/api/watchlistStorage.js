import AsyncStorage from "@react-native-async-storage/async-storage";

const WATCHLIST_KEY = "finsightMobileWatchlist";

export async function getWatchlist() {
  try {
    const savedWatchlist = await AsyncStorage.getItem(WATCHLIST_KEY);

    if (!savedWatchlist) {
      return [];
    }

    const parsedWatchlist = JSON.parse(savedWatchlist);

    if (!Array.isArray(parsedWatchlist)) {
      return [];
    }

    return parsedWatchlist;
  } catch (error) {
    console.log("Get watchlist error:", error);
    return [];
  }
}

export async function saveWatchlist(watchlist) {
  try {
    await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  } catch (error) {
    console.log("Save watchlist error:", error);
    throw new Error("Unable to save local watchlist.");
  }
}

export async function addToWatchlist(stockData) {
  try {
    if (!stockData || !stockData.ticker) {
      throw new Error("Invalid stock data.");
    }

    const currentWatchlist = await getWatchlist();

    const alreadySaved = currentWatchlist.some(
      (item) => item.ticker === stockData.ticker
    );

    if (alreadySaved) {
      return currentWatchlist;
    }

    const newItem = {
      ticker: stockData.ticker,
      company_name: stockData.company_name || stockData.ticker,
      latest_price: stockData.latest_price ?? null,
      risk_level: stockData.risk_level || "N/A",
      annualized_volatility: stockData.annualized_volatility ?? null,
      maximum_drawdown: stockData.maximum_drawdown ?? null,
      average_daily_return: stockData.average_daily_return ?? null,
      volatility: stockData.volatility ?? null,
      period: stockData.period || "1y",
      saved_at: new Date().toLocaleString(),
    };

    const updatedWatchlist = [newItem, ...currentWatchlist];

    await saveWatchlist(updatedWatchlist);

    return updatedWatchlist;
  } catch (error) {
    console.log("Add to watchlist error:", error);
    throw error;
  }
}

export async function removeFromWatchlist(ticker) {
  try {
    const currentWatchlist = await getWatchlist();

    const updatedWatchlist = currentWatchlist.filter(
      (item) => item.ticker !== ticker
    );

    await saveWatchlist(updatedWatchlist);

    return updatedWatchlist;
  } catch (error) {
    console.log("Remove watchlist error:", error);
    throw error;
  }
}

export async function clearWatchlist() {
  try {
    await AsyncStorage.removeItem(WATCHLIST_KEY);
  } catch (error) {
    console.log("Clear watchlist error:", error);
    throw error;
  }
}