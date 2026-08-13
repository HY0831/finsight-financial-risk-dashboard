import { useCallback, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  clearWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "../api/watchlistStorage";
import { colors } from "../theme/colors";

export default function WatchlistScreen() {
  const [watchlist, setWatchlist] = useState([]);

  const loadWatchlist = async () => {
    const savedWatchlist = await getWatchlist();
    setWatchlist(savedWatchlist);
  };

  useFocusEffect(
    useCallback(() => {
      loadWatchlist();
    }, [])
  );

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

  const handleRemove = async (ticker) => {
    const updatedWatchlist = await removeFromWatchlist(ticker);
    setWatchlist(updatedWatchlist);
  };

  const handleClear = async () => {
    await clearWatchlist();
    setWatchlist([]);
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

  const highRiskCount = watchlist.filter(
    (item) => item.risk_level === "High Risk"
  ).length;

  const mediumRiskCount = watchlist.filter(
    (item) => item.risk_level === "Medium Risk"
  ).length;

  const lowRiskCount = watchlist.filter(
    (item) => item.risk_level === "Low Risk"
  ).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.tag}>Watchlist</Text>
          <Text style={styles.title}>Saved Assets</Text>
          <Text style={styles.description}>
            Review stocks saved from your analysis results. This mobile version
            currently stores data locally on your device.
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>{watchlist.length}</Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Low</Text>
            <Text style={styles.summaryValue}>{lowRiskCount}</Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Medium</Text>
            <Text style={styles.summaryValue}>{mediumRiskCount}</Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>High</Text>
            <Text style={styles.summaryValue}>{highRiskCount}</Text>
          </View>
        </View>

        {watchlist.length > 0 ? (
          <Pressable style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear Watchlist</Text>
          </Pressable>
        ) : null}

        {watchlist.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No Saved Assets Yet</Text>
            <Text style={styles.emptyText}>
              Go to the Analyze tab, analyse a stock, and save it to your
              watchlist.
            </Text>
          </View>
        ) : (
          <View style={styles.listSection}>
            {watchlist.map((item) => (
              <View key={item.ticker} style={styles.stockCard}>
                <View style={styles.stockHeader}>
                  <View>
                    <Text style={styles.ticker}>{item.ticker}</Text>
                    <Text style={styles.companyName}>
                      {item.company_name || "N/A"}
                    </Text>
                  </View>

                  <View style={[styles.riskBadge, getRiskStyle(item.risk_level)]}>
                    <Text style={styles.riskBadgeText}>{item.risk_level}</Text>
                  </View>
                </View>

                <View style={styles.metricRow}>
                  <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>Latest Price</Text>
                    <Text style={styles.metricValue}>
                      {formatMoney(item.latest_price)}
                    </Text>
                  </View>

                  <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>Annual Volatility</Text>
                    <Text style={styles.metricValue}>
                      {formatPercent(item.annualized_volatility)}
                    </Text>
                  </View>
                </View>

                <View style={styles.metricRow}>
                  <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>Max Drawdown</Text>
                    <Text style={styles.metricValue}>
                      {formatPercent(item.maximum_drawdown)}
                    </Text>
                  </View>

                  <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>Saved At</Text>
                    <Text style={styles.savedAtText}>{item.saved_at}</Text>
                  </View>
                </View>

                <Pressable
                  style={styles.removeButton}
                  onPress={() => handleRemove(item.ticker)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
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

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18,
  },

  summaryBox: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  summaryLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },

  summaryValue: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: "900",
  },

  clearButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 18,
  },

  clearButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },

  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },

  emptyTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },

  emptyText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
  },

  listSection: {
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

  savedAtText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17,
  },

  removeButton: {
    backgroundColor: "#fef2f2",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#fecaca",
  },

  removeButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "900",
  },
});