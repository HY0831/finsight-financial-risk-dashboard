import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  getCloudWatchlist,
  removeCloudWatchlistItem,
} from "../api/finsightApi";
import { getAuthToken } from "../api/authStorage";
import {
  clearWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "../api/watchlistStorage";
import { colors } from "../theme/colors";

export default function WatchlistScreen() {
  const [watchlist, setWatchlist] = useState([]);
  const [storageMode, setStorageMode] = useState("Local");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadWatchlist = async () => {
    setLoading(true);
    setMessage("");

    try {
      const token = await getAuthToken();

      if (token) {
        const cloudWatchlist = await getCloudWatchlist(token);
        setWatchlist(cloudWatchlist);
        setStorageMode("Cloud");
        return;
      }

      const savedWatchlist = await getWatchlist();
      setWatchlist(savedWatchlist);
      setStorageMode("Local");
    } catch {
      const savedWatchlist = await getWatchlist();
      setWatchlist(savedWatchlist);
      setStorageMode("Local");
      setMessage("Unable to load cloud watchlist. Showing local watchlist.");
    } finally {
      setLoading(false);
    }
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
    try {
      const token = await getAuthToken();

      if (token && storageMode === "Cloud") {
        await removeCloudWatchlistItem(token, ticker);
        await loadWatchlist();
        setMessage(`${ticker} removed from cloud Watchlist.`);
        return;
      }

      const updatedWatchlist = await removeFromWatchlist(ticker);
      setWatchlist(updatedWatchlist);
      setMessage(`${ticker} removed from local Watchlist.`);
    } catch {
      setMessage("Unable to remove item.");
    }
  };

  const handleClear = async () => {
    if (storageMode === "Cloud") {
      setMessage("Cloud clear is not enabled yet. Remove items one by one.");
      return;
    }

    await clearWatchlist();
    setWatchlist([]);
    setMessage("Local Watchlist cleared.");
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
            Review saved stocks. Logged-in users use cloud storage, while guests
            use local device storage.
          </Text>
        </View>

        <View style={styles.modeCard}>
          <Text style={styles.modeLabel}>Current Storage Mode</Text>
          <Text style={styles.modeValue}>{storageMode}</Text>
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

        {message ? (
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Loading Watchlist...</Text>
          </View>
        ) : null}

        {watchlist.length > 0 ? (
          <Pressable style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>
              {storageMode === "Cloud" ? "Cloud Clear Disabled" : "Clear Watchlist"}
            </Text>
          </Pressable>
        ) : null}

        {watchlist.length === 0 && !loading ? (
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
                    <Text style={styles.riskBadgeText}>
                      {item.risk_level || "N/A"}
                    </Text>
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
                    <Text style={styles.savedAtText}>
                      {item.saved_at || item.created_at || "N/A"}
                    </Text>
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

  modeCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },

  modeLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },

  modeValue: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "900",
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