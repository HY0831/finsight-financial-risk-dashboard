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

import { analyzeStock } from "../api/finsightApi";
import { colors } from "../theme/colors";

const periods = [
  { label: "6 Months", value: "6mo" },
  { label: "1 Year", value: "1y" },
  { label: "3 Years", value: "3y" },
  { label: "5 Years", value: "5y" },
];

export default function CompareScreen() {
  const [tickerOne, setTickerOne] = useState("");
  const [tickerTwo, setTickerTwo] = useState("");
  const [period, setPeriod] = useState("1y");
  const [stockOne, setStockOne] = useState(null);
  const [stockTwo, setStockTwo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleCompare = async () => {
    const firstTicker = tickerOne.trim().toUpperCase();
    const secondTicker = tickerTwo.trim().toUpperCase();

    if (!firstTicker || !secondTicker) {
      setError("Please enter two stock tickers, for example AAPL and TSLA.");
      return;
    }

    if (firstTicker === secondTicker) {
      setError("Please enter two different stock tickers.");
      return;
    }

    setLoading(true);
    setError("");
    setStockOne(null);
    setStockTwo(null);

    try {
      const [firstResult, secondResult] = await Promise.all([
        analyzeStock(firstTicker, period),
        analyzeStock(secondTicker, period),
      ]);

      setStockOne(firstResult);
      setStockTwo(secondResult);
    } catch (err) {
      setError(err.message || "Unable to compare stocks.");
    } finally {
      setLoading(false);
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

  const getComparisonSummary = () => {
    if (!stockOne || !stockTwo) {
      return "";
    }

    const lowerVolatilityStock =
      stockOne.annualized_volatility <= stockTwo.annualized_volatility
        ? stockOne
        : stockTwo;

    const higherReturnStock =
      stockOne.average_daily_return >= stockTwo.average_daily_return
        ? stockOne
        : stockTwo;

    const smallerDrawdownStock =
      stockOne.maximum_drawdown >= stockTwo.maximum_drawdown
        ? stockOne
        : stockTwo;

    return `${lowerVolatilityStock.ticker} has lower annualized volatility, while ${higherReturnStock.ticker} has higher average daily return. Based on maximum drawdown, ${smallerDrawdownStock.ticker} had a smaller peak-to-bottom loss during the selected period.`;
  };

  const renderStockCard = (stockData) => {
    return (
      <View style={styles.stockCard}>
        <View style={styles.stockHeader}>
          <View>
            <Text style={styles.ticker}>{stockData.ticker}</Text>
            <Text style={styles.companyName}>{stockData.company_name}</Text>
          </View>

          <View style={[styles.riskBadge, getRiskStyle(stockData.risk_level)]}>
            <Text style={styles.riskBadgeText}>{stockData.risk_level}</Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Latest Price</Text>
            <Text style={styles.metricValue}>
              {formatMoney(stockData.latest_price)}
            </Text>
          </View>

          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Avg Return</Text>
            <Text style={styles.metricValue}>
              {formatPercent(stockData.average_daily_return)}
            </Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Annual Volatility</Text>
            <Text style={styles.metricValue}>
              {formatPercent(stockData.annualized_volatility)}
            </Text>
          </View>

          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Max Drawdown</Text>
            <Text style={styles.metricValue}>
              {formatPercent(stockData.maximum_drawdown)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.tag}>Compare</Text>
          <Text style={styles.title}>Stock Comparison</Text>
          <Text style={styles.description}>
            Compare two stocks side by side using the same analysis period and
            risk metrics.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>First Stock</Text>
          <TextInput
            style={styles.input}
            value={tickerOne}
            onChangeText={setTickerOne}
            placeholder="Example: AAPL"
            placeholderTextColor="#9ca3af"
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Second Stock</Text>
          <TextInput
            style={styles.input}
            value={tickerTwo}
            onChangeText={setTickerTwo}
            placeholder="Example: TSLA"
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
            style={[styles.compareButton, loading && styles.buttonDisabled]}
            onPress={handleCompare}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.compareButtonText}>Compare Stocks</Text>
            )}
          </Pressable>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Unable to Compare</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {stockOne && stockTwo ? (
          <View style={styles.resultSection}>
            {renderStockCard(stockOne)}
            {renderStockCard(stockTwo)}

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Comparison Summary</Text>
              <Text style={styles.summaryText}>{getComparisonSummary()}</Text>
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

  compareButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  compareButtonText: {
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

  stockCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  stockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },

  ticker: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 4,
  },

  companyName: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
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

  metricRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  metricBox: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },

  metricValue: {
    color: colors.primary,
    fontSize: 16,
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
});