import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getGoldPrice } from "../api/finsightApi";
import { colors } from "../theme/colors";

const periods = [
  { label: "1 Week", value: "1w" },
  { label: "1 Month", value: "1mo" },
  { label: "3 Months", value: "3mo" },
  { label: "1 Year", value: "1y" },
  { label: "5 Years", value: "5y" },
];

export default function GoldScreen() {
  const [period, setPeriod] = useState("1y");
  const [goldData, setGoldData] = useState(null);
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

  const fetchGoldData = async (selectedPeriod = period) => {
    setLoading(true);
    setError("");

    try {
      const result = await getGoldPrice(selectedPeriod);
      setGoldData(result);
    } catch (err) {
      setError(err.message || "Unable to load gold price.");
      setGoldData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoldData(period);
  }, [period]);

  const isPositiveChange = goldData && goldData.price_change >= 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.tag}>Gold Market</Text>
          <Text style={styles.title}>Gold Price Dashboard</Text>
          <Text style={styles.description}>
            Track gold futures price, trend movement, volatility, and maximum
            drawdown using simple risk metrics.
          </Text>
        </View>

        <View style={styles.periodCard}>
          <Text style={styles.label}>Select Period</Text>

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
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Loading gold price data...</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Unable to Load Gold Price</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {goldData && !loading ? (
          <View style={styles.resultSection}>
            <View style={styles.priceCard}>
              <Text style={styles.assetName}>{goldData.asset_name}</Text>
              <Text style={styles.priceValue}>
                {formatMoney(goldData.latest_price)}
              </Text>

              <Text
                style={[
                  styles.priceChange,
                  isPositiveChange ? styles.positiveChange : styles.negativeChange,
                ]}
              >
                {isPositiveChange ? "+" : ""}
                {formatMoney(goldData.price_change)} (
                {isPositiveChange ? "+" : ""}
                {formatPercent(goldData.price_change_percent)})
              </Text>

              <Text style={styles.sourceText}>
                Data source ticker: {goldData.ticker}
              </Text>
            </View>

            <View style={styles.metricGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Highest Price</Text>
                <Text style={styles.metricValue}>
                  {formatMoney(goldData.highest_price)}
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Lowest Price</Text>
                <Text style={styles.metricValue}>
                  {formatMoney(goldData.lowest_price)}
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Average Price</Text>
                <Text style={styles.metricValue}>
                  {formatMoney(goldData.average_price)}
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Daily Volatility</Text>
                <Text style={styles.metricValue}>
                  {formatPercent(goldData.volatility)}
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Annual Volatility</Text>
                <Text style={styles.metricValue}>
                  {formatPercent(goldData.annualized_volatility)}
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Max Drawdown</Text>
                <Text style={styles.metricValue}>
                  {formatPercent(goldData.maximum_drawdown)}
                </Text>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Gold Market Insight</Text>
              <Text style={styles.summaryText}>{goldData.summary}</Text>
            </View>

            <View style={styles.noteCard}>
              <Text style={styles.noteTitle}>Important Note</Text>
              <Text style={styles.noteText}>
                This page uses gold futures data from Yahoo Finance ticker GC=F.
                It does not represent physical gold jewellery price or local
                retail gold shop price.
              </Text>
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

  periodCard: {
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
    marginBottom: 12,
  },

  periodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
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

  priceCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },

  assetName: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8,
  },

  priceValue: {
    color: colors.primary,
    fontSize: 38,
    fontWeight: "900",
    marginBottom: 8,
  },

  priceChange: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },

  positiveChange: {
    color: colors.success,
  },

  negativeChange: {
    color: colors.danger,
  },

  sourceText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
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

  noteCard: {
    backgroundColor: "#fffbeb",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#fde68a",
  },

  noteTitle: {
    color: colors.warning,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },

  noteText: {
    color: "#78350f",
    fontSize: 14,
    lineHeight: 21,
  },
});