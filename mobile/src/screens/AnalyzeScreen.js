import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  addCloudHistoryItem,
  addCloudWatchlistItem,
  analyzeStock,
  searchStocks,
} from "../api/finsightApi";
import { getAuthToken } from "../api/authStorage";
import { addToWatchlist } from "../api/watchlistStorage";
import { addToHistory } from "../api/historyStorage";
import SimpleLineChart from "../components/SimpleLineChart";
import { colors } from "../theme/colors";

const periodOptions = [
  { label: "6M", value: "6mo" },
  { label: "1Y", value: "1y" },
  { label: "3Y", value: "3y" },
  { label: "5Y", value: "5y" },
];

export default function AnalyzeScreen() {
  const [ticker, setTicker] = useState("");
  const [period, setPeriod] = useState("1y");
  const [stockData, setStockData] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const searchText = ticker.trim();

    if (searchText.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setSearchLoading(true);

        const data = await searchStocks(searchText);

        const results = Array.isArray(data.results) ? data.results : [];

        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (searchError) {
        console.log("Stock suggestion search error:", searchError);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [ticker]);

  const formatMoney = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "N/A";
    }

    return `$${Number(value).toFixed(2)}`;
  };

  const formatPercent = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "N/A";
    }

    return `${(Number(value) * 100).toFixed(2)}%`;
  };

  const handleSelectSuggestion = (item) => {
    setTicker(item.ticker);
    setSuggestions([]);
    setShowSuggestions(false);
    setError("");
    setSaveMessage("");
  };

  const handleAnalyze = async () => {
    if (!ticker.trim()) {
      setError("Please enter a stock ticker, for example AAPL or TSLA.");
      return;
    }

    setLoading(true);
    setError("");
    setSaveMessage("");
    setStockData(null);
    setSuggestions([]);
    setShowSuggestions(false);

    try {
      const selectedTicker = ticker.trim().toUpperCase();

      const result = await analyzeStock(selectedTicker, period);

      setStockData(result);

      try {
        const token = await getAuthToken();

        if (token) {
          await addCloudHistoryItem(token, {
            ...result,
            period,
          });
        } else {
          await addToHistory(result, period);
        }
      } catch (historyError) {
        console.log("History save error:", historyError);

        try {
          await addToHistory(result, period);
        } catch (localHistoryError) {
          console.log("Local history fallback error:", localHistoryError);
        }
      }
    } catch (err) {
      console.log("Analyze error:", err);
      setError(err.message || "Unable to analyze stock. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToWatchlist = async () => {
    if (!stockData) {
      setSaveMessage("No stock data to save.");
      return;
    }

    try {
      const token = await getAuthToken();

      if (token) {
        try {
          await addCloudWatchlistItem(token, {
            ...stockData,
            period,
          });

          setSaveMessage(`${stockData.ticker} saved to cloud Watchlist.`);
          return;
        } catch (cloudError) {
          console.log("Cloud watchlist save error:", cloudError);
        }
      }

      await addToWatchlist({
        ...stockData,
        period,
      });

      setSaveMessage(`${stockData.ticker} saved to local Watchlist.`);
    } catch (watchlistError) {
      console.log("Watchlist save error:", watchlistError);
      setSaveMessage("Unable to save stock to Watchlist.");
    }
  };

  const getRiskStyle = (riskLevel) => {
    if (riskLevel === "Low Risk") {
      return styles.lowRisk;
    }

    if (riskLevel === "Medium Risk") {
      return styles.mediumRisk;
    }

    if (riskLevel === "High Risk") {
      return styles.highRisk;
    }

    return styles.neutralRisk;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <Text style={styles.tag}>Stock Analysis</Text>
          <Text style={styles.title}>Analyze Stock Risk</Text>
          <Text style={styles.description}>
            Search by ticker or company name. FinSight will calculate volatility,
            maximum drawdown, and risk level.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Stock Search</Text>

          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Example: AAP, Apple, TSLA"
              placeholderTextColor="#9ca3af"
              value={ticker}
              autoCapitalize="characters"
              onChangeText={(value) => {
                setTicker(value);
                setError("");
                setSaveMessage("");
              }}
            />

            {searchLoading ? (
              <View style={styles.searchLoadingRow}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.searchLoadingText}>Searching...</Text>
              </View>
            ) : null}

            {showSuggestions ? (
              <View style={styles.suggestionBox}>
                {suggestions.map((item) => (
                  <Pressable
                    key={`${item.ticker}-${item.exchange}`}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(item)}
                  >
                    <View>
                      <Text style={styles.suggestionTicker}>{item.ticker}</Text>
                      <Text style={styles.suggestionName}>
                        {item.name || "N/A"}
                      </Text>
                    </View>

                    <Text style={styles.suggestionExchange}>
                      {item.exchange || "N/A"}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>

          <Text style={styles.label}>Analysis Period</Text>

          <View style={styles.periodRow}>
            {periodOptions.map((item) => (
              <Pressable
                key={item.value}
                style={[
                  styles.periodButton,
                  period === item.value && styles.periodButtonActive,
                ]}
                onPress={() => setPeriod(item.value)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    period === item.value && styles.periodButtonTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={[styles.analyzeButton, loading && styles.disabledButton]}
            onPress={handleAnalyze}
            disabled={loading}
          >
            <Text style={styles.analyzeButtonText}>
              {loading ? "Analyzing..." : "Analyze Stock"}
            </Text>
          </Pressable>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {saveMessage ? (
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>{saveMessage}</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Loading stock analysis...</Text>
          </View>
        ) : null}

        {stockData ? (
          <View style={styles.resultSection}>
            <View style={styles.resultHeaderCard}>
              <View>
                <Text style={styles.ticker}>{stockData.ticker}</Text>
                <Text style={styles.companyName}>
                  {stockData.company_name || "N/A"}
                </Text>
              </View>

              <View style={[styles.riskBadge, getRiskStyle(stockData.risk_level)]}>
                <Text style={styles.riskBadgeText}>{stockData.risk_level}</Text>
              </View>
            </View>

            <View style={styles.metricGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Latest Price</Text>
                <Text style={styles.metricValue}>
                  {formatMoney(stockData.latest_price)}
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Annual Volatility</Text>
                <Text style={styles.metricValue}>
                  {formatPercent(stockData.annualized_volatility)}
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Max Drawdown</Text>
                <Text style={styles.metricValue}>
                  {formatPercent(stockData.maximum_drawdown)}
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Average Daily Return</Text>
                <Text style={styles.metricValue}>
                  {formatPercent(stockData.average_daily_return)}
                </Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.sectionTitle}>Price Trend</Text>
              <SimpleLineChart data={stockData.price_data || []} />
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.sectionTitle}>Risk Summary</Text>
              <Text style={styles.summaryText}>{stockData.summary}</Text>
            </View>

            <Pressable
              style={styles.watchlistButton}
              onPress={handleSaveToWatchlist}
            >
              <Text style={styles.watchlistButtonText}>Save to Watchlist</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 18,
    paddingBottom: 36,
  },

  hero: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
  },

  tag: {
    color: "#d1d5db",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 10,
    textTransform: "uppercase",
  },

  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 36,
    marginBottom: 10,
  },

  description: {
    color: "#e5e7eb",
    fontSize: 15,
    lineHeight: 23,
  },

  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },

  label: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
  },

  searchWrapper: {
    position: "relative",
    marginBottom: 16,
    zIndex: 10,
  },

  input: {
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },

  searchLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },

  searchLoadingText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },

  suggestionBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
    overflow: "hidden",
  },

  suggestionItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  suggestionTicker: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 3,
  },

  suggestionName: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
    maxWidth: 220,
  },

  suggestionExchange: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "800",
    alignSelf: "center",
  },

  periodRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },

  periodButton: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    alignItems: "center",
  },

  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  periodButtonText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
  },

  periodButtonTextActive: {
    color: "#ffffff",
  },

  analyzeButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  analyzeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },

  errorCard: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },

  errorText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "800",
  },

  messageCard: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },

  messageText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: "800",
  },

  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
    alignItems: "center",
    gap: 10,
  },

  loadingText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700",
  },

  resultSection: {
    gap: 16,
  },

  resultHeaderCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  ticker: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 4,
  },

  companyName: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
    maxWidth: 190,
  },

  riskBadge: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },

  riskBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
  },

  lowRisk: {
    backgroundColor: colors.success,
  },

  mediumRisk: {
    backgroundColor: colors.warning,
  },

  highRisk: {
    backgroundColor: colors.danger,
  },

  neutralRisk: {
    backgroundColor: colors.secondary,
  },

  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  metricCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },

  metricValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900",
  },

  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 12,
  },

  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  summaryText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
  },

  watchlistButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },

  watchlistButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
});