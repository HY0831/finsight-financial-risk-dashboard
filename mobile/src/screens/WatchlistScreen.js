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
import { useAppTheme } from "../theme/ThemeContext";

export default function WatchlistScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

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
        setWatchlist(cloudWatchlist || []);
        setStorageMode("Cloud");
        return;
      }

      const localWatchlist = await getWatchlist();
      setWatchlist(localWatchlist || []);
      setStorageMode("Local");
    } catch (error) {
      console.log("Cloud watchlist load error:", error);

      const localWatchlist = await getWatchlist();
      setWatchlist(localWatchlist || []);
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

  const handleRemove = async (ticker) => {
    try {
      const token = await getAuthToken();

      if (token && storageMode === "Cloud") {
        await removeCloudWatchlistItem(token, ticker);
        const updatedWatchlist = watchlist.filter(
          (item) => item.ticker !== ticker
        );
        setWatchlist(updatedWatchlist);
        setMessage(`${ticker} removed from cloud Watchlist.`);
        return;
      }

      const updatedWatchlist = await removeFromWatchlist(ticker);
      setWatchlist(updatedWatchlist);
      setMessage(`${ticker} removed from local Watchlist.`);
    } catch (error) {
      console.log("Remove watchlist error:", error);
      setMessage("Unable to remove stock from Watchlist.");
    }
  };

  const handleClearLocalWatchlist = async () => {
    try {
      if (storageMode === "Cloud") {
        setMessage("Cloud clear is disabled. Remove stocks one by one.");
        return;
      }

      await clearWatchlist();
      setWatchlist([]);
      setMessage("Local Watchlist cleared.");
    } catch (error) {
      console.log("Clear watchlist error:", error);
      setMessage("Unable to clear Watchlist.");
    }
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

  const averageVolatility =
    watchlist.length > 0
      ? watchlist.reduce(
          (total, item) => total + Number(item.annualized_volatility || 0),
          0
        ) / watchlist.length
      : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.tag}>Watchlist</Text>
          <Text style={styles.title}>Saved Stocks</Text>
          <Text style={styles.description}>
            Track stocks saved from analysis. Logged-in users use cloud
            watchlist, while guests use local device watchlist.
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
            <Text style={styles.summaryLabel}>Average Volatility</Text>
            <Text style={styles.summaryValue}>
              {formatPercent(averageVolatility)}
            </Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Low Risk</Text>
            <Text style={styles.summaryValue}>{lowRiskCount}</Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>High Risk</Text>
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

        <View style={styles.actionRow}>
          <Pressable style={styles.refreshButton} onPress={loadWatchlist}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </Pressable>

          <Pressable
            style={styles.clearButton}
            onPress={handleClearLocalWatchlist}
          >
            <Text style={styles.clearButtonText}>Clear Local</Text>
          </Pressable>
        </View>

        {watchlist.length === 0 && !loading ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No Saved Stocks Yet</Text>
            <Text style={styles.emptyText}>
              Go to the Analyze tab, analyse a stock, and save it to Watchlist.
            </Text>
          </View>
        ) : (
          <View style={styles.listSection}>
            {watchlist.map((item) => (
              <View key={`${item.ticker}-${item.id || item.saved_at}`} style={styles.stockCard}>
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

                <Text style={styles.savedText}>
                  Saved: {item.saved_at || "Cloud saved"}
                </Text>

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

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Risk Distribution</Text>
          <Text style={styles.noteText}>
            Low Risk: {lowRiskCount} | Medium Risk: {mediumRiskCount} | High
            Risk: {highRiskCount}
          </Text>
        </View>
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
      fontSize: 12,
      fontWeight: "700",
      marginBottom: 8,
    },

    summaryValue: {
      color: colors.primary,
      fontSize: 20,
      fontWeight: "900",
    },

    messageCard: {
      backgroundColor: colors.messageBackground,
      borderWidth: 1,
      borderColor: colors.messageBorder,
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

    actionRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 18,
    },

    refreshButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: "center",
    },

    refreshButtonText: {
      color: colors.surface,
      fontSize: 14,
      fontWeight: "900",
    },

    clearButton: {
      flex: 1,
      backgroundColor: colors.inputBackground,
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },

    clearButtonText: {
      color: colors.primary,
      fontSize: 14,
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
      backgroundColor: colors.inputBackground,
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

    savedText: {
      color: colors.muted,
      fontSize: 12,
      fontWeight: "700",
      marginTop: 2,
      marginBottom: 12,
    },

    removeButton: {
      backgroundColor: colors.danger,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: "center",
    },

    removeButtonText: {
      color: "#ffffff",
      fontSize: 13,
      fontWeight: "900",
    },

    noteCard: {
      backgroundColor: colors.noteBackground,
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.noteBorder,
      marginTop: 18,
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