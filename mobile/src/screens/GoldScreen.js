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
import SimpleLineChart from "../components/SimpleLineChart";
import { useAppTheme } from "../theme/ThemeContext";

const periodOptions = [
  { label: "1W", value: "1w" },
  { label: "1M", value: "1mo" },
  { label: "3M", value: "3mo" },
  { label: "1Y", value: "1y" },
  { label: "5Y", value: "5y" },
];

export default function GoldScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [period, setPeriod] = useState("1y");
  const [goldData, setGoldData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadGoldData = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getGoldPrice(period);
      setGoldData(result);
    } catch (goldError) {
      console.log("Gold load error:", goldError);
      setError(goldError.message || "Unable to load gold price.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoldData();
  }, [period]);

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

  const getChangeStyle = () => {
    if (!goldData) {
      return styles.neutralChange;
    }

    if (Number(goldData.price_change) > 0) {
      return styles.positiveChange;
    }

    if (Number(goldData.price_change) < 0) {
      return styles.negativeChange;
    }

    return styles.neutralChange;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.tag}>Gold Dashboard</Text>
          <Text style={styles.title}>Gold Price Risk Analysis</Text>
          <Text style={styles.description}>
            Track gold futures price movement, volatility, and maximum drawdown.
            This uses Yahoo Finance ticker GC=F.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Time Range</Text>

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
            style={[styles.refreshButton, loading && styles.disabledButton]}
            onPress={loadGoldData}
            disabled={loading}
          >
            <Text style={styles.refreshButtonText}>
              {loading ? "Loading..." : "Refresh Gold Data"}
            </Text>
          </Pressable>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Loading gold price...</Text>
          </View>
        ) : null}

        {goldData ? (
          <View style={styles.resultSection}>
            <View style={styles.priceCard}>
              <Text style={styles.assetName}>
                {goldData.asset_name || "Gold Futures"}
              </Text>
              <Text style={styles.ticker}>{goldData.ticker || "GC=F"}</Text>

              <Text style={styles.latestPrice}>
                {formatMoney(goldData.latest_price)}
              </Text>

              <View style={[styles.changeBadge, getChangeStyle()]}>
                <Text style={styles.changeText}>
                  {formatMoney(goldData.price_change)} (
                  {formatPercent(goldData.price_change_percent)})
                </Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.sectionTitle}>Gold Price Trend</Text>
              <SimpleLineChart data={goldData.price_data || []} />
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
              <Text style={styles.sectionTitle}>Gold Market Insight</Text>
              <Text style={styles.summaryText}>{goldData.summary}</Text>
            </View>

            <View style={styles.noteCard}>
              <Text style={styles.noteTitle}>Important Note</Text>
              <Text style={styles.noteText}>
                This feature uses gold futures data. It does not represent local
                jewellery shop price or physical gold retail price.
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      padding: 18,
      paddingBottom: 36,
    },

    hero: {
      backgroundColor: colors.heroBackground,
      borderRadius: 24,
      padding: 24,
      marginBottom: 18,
    },

    tag: {
      color: colors.heroMuted,
      fontSize: 13,
      fontWeight: "800",
      letterSpacing: 0.5,
      marginBottom: 10,
      textTransform: "uppercase",
    },

    title: {
      color: colors.heroText,
      fontSize: 28,
      fontWeight: "900",
      lineHeight: 36,
      marginBottom: 10,
    },

    description: {
      color: colors.heroMuted,
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

    periodRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 16,
    },

    periodButton: {
      flex: 1,
      backgroundColor: colors.inputBackground,
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
      color: colors.surface,
    },

    refreshButton: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 15,
      alignItems: "center",
    },

    disabledButton: {
      opacity: 0.6,
    },

    refreshButtonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: "900",
    },

    errorCard: {
      backgroundColor: colors.errorBackground,
      borderWidth: 1,
      borderColor: colors.errorBorder,
      borderRadius: 16,
      padding: 14,
      marginBottom: 14,
    },

    errorText: {
      color: colors.danger,
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

    priceCard: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },

    assetName: {
      color: colors.primary,
      fontSize: 22,
      fontWeight: "900",
      marginBottom: 4,
    },

    ticker: {
      color: colors.muted,
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 12,
    },

    latestPrice: {
      color: colors.primary,
      fontSize: 34,
      fontWeight: "900",
      marginBottom: 12,
    },

    changeBadge: {
      alignSelf: "flex-start",
      borderRadius: 999,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },

    positiveChange: {
      backgroundColor: colors.success,
    },

    negativeChange: {
      backgroundColor: colors.danger,
    },

    neutralChange: {
      backgroundColor: colors.secondary,
    },

    changeText: {
      color: "#ffffff",
      fontSize: 13,
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
      fontSize: 17,
      fontWeight: "900",
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

    noteCard: {
      backgroundColor: colors.noteBackground,
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.noteBorder,
    },

    noteTitle: {
      color: colors.warning,
      fontSize: 17,
      fontWeight: "900",
      marginBottom: 6,
    },

    noteText: {
      color: colors.secondary,
      fontSize: 14,
      lineHeight: 21,
    },
  });
}