import { useState } from "react";
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
} from "../api/finsightApi";
import { getAuthToken } from "../api/authStorage";
import { addToWatchlist } from "../api/watchlistStorage";
import { addToHistory } from "../api/historyStorage";
import SimpleLineChart from "../components/SimpleLineChart";
import { colors } from "../theme/colors";

const periods = [
  { label: "6 Months", value: "6mo" },
  { label: "1 Year", value: "1y" },
  { label: "3 Years", value: "3y" },
  { label: "5 Years", value: "5y" },
];

export default function AnalyzeScreen() {
  const [ticker, setTicker] = useState("");
  const [period, setPeriod] = useState("1y");
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

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

  const handleAnalyze = async () => {
  if (!ticker.trim()) {
    setError("Please enter a stock ticker, for example AAPL or TSLA.");
    return;
  }

  setLoading(true);
  setError("");
  setSaveMessage("");
  setStockData(null);

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
    setError(err.message || "Something went wrong while analysing the stock.");
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
  } catch (error) {
    console.log("Local watchlist save error:", error);
    setSaveMessage(error.message || "Unable to save stock to Watchlist.");
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
      >
        <View style={styles.hero}>
          <Text style={styles.tag}>Analyze</Text>
          <Text style={styles.title}>Stock Risk Analysis</Text>
          <Text style={styles.description}>
            Enter a stock ticker and FinSight will calculate risk metrics using
            historical market data.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Stock Ticker</Text>

          <TextInput
            style={styles.input}
            value={ticker}
            onChangeText={setTicker}
            placeholder="Example: AAPL"
            placeholderTextColor="#9ca3af"
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Analysis Period</Text>

          <View style={styles.periodGrid}>
            {periods.map((item) => (
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
            style={[styles.analyzeButton, loading && styles.buttonDisabled]}
            onPress={handleAnalyze}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.analyzeButtonText}>Analyze Stock</Text>
            )}
          </Pressable>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Unable to Analyze</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {stockData ? (
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.resultTicker}>{stockData.ticker}</Text>
                <Text style={styles.resultCompany}>
                  {stockData.company_name}
                </Text>
              </View>

              <View style={[styles.riskBadge, getRiskStyle(stockData.risk_level)]}>
                <Text style={styles.riskBadgeText}>{stockData.risk_level}</Text>
              </View>
            </View>

            <SimpleLineChart
              title="Stock Price Trend"
              data={stockData.price_data}
              dataKey="close"
              valuePrefix="$"
            />

            <View style={styles.metricGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Latest Price</Text>
                <Text style={styles.metricValue}>
                  {formatMoney(stockData.latest_price)}
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Average Return</Text>
                <Text style={styles.metricValue}>
                  {formatPercent(stockData.average_daily_return)}
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Daily Volatility</Text>
                <Text style={styles.metricValue}>
                  {formatPercent(stockData.volatility)}
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
                <Text style={styles.metricLabel}>Period</Text>
                <Text style={styles.metricValue}>{stockData.period}</Text>
              </View>
            </View>

            <Pressable style={styles.saveButton} onPress={handleSaveToWatchlist}>
                <Text style={styles.saveButtonText}>Save to Watchlist</Text>
            </Pressable>

            {saveMessage ? (
                <View style={styles.saveMessageCard}>
                    <Text style={styles.saveMessageText}>{saveMessage}</Text>
                </View>
            ) : null}

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Risk Summary</Text>
              <Text style={styles.summaryText}>{stockData.summary}</Text>
            </View>
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
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },

  label: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.primary,
    marginBottom: 18,
  },

  periodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },

  periodButton: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  periodButtonText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "800",
  },

  periodButtonTextActive: {
    color: "#ffffff",
  },

  analyzeButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.7,
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
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },

  errorTitle: {
    color: colors.danger,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },

  errorText: {
    color: "#7f1d1d",
    fontSize: 14,
    lineHeight: 21,
  },

  resultSection: {
    gap: 16,
  },

  resultHeader: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  resultTicker: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 4,
  },

  resultCompany: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
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
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },

  metricValue: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: "900",
  },

  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },

  summaryTitle: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 8,
  },

  summaryText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
  },

  saveButton: {
  backgroundColor: colors.primary,
  borderRadius: 16,
  paddingVertical: 15,
  alignItems: "center",
},

saveButtonText: {
  color: "#ffffff",
  fontSize: 16,
  fontWeight: "900",
},

saveMessageCard: {
  backgroundColor: "#ecfdf5",
  borderWidth: 1,
  borderColor: "#bbf7d0",
  borderRadius: 16,
  padding: 14,
},

saveMessageText: {
  color: colors.success,
  fontSize: 14,
  fontWeight: "800",
},
});