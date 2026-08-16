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
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { analyzeStock } from "../api/finsightApi";
import { clearHistory, getHistory } from "../api/historyStorage";
import { addToWatchlist } from "../api/watchlistStorage";
import { colors } from "../theme/colors";

export default function HistoryScreen() {
  const navigation = useNavigation();

  const [history, setHistory] = useState([]);
  const [loadingTicker, setLoadingTicker] = useState("");
  const [message, setMessage] = useState("");

  const loadHistory = async () => {
    const savedHistory = await getHistory();
    setHistory(savedHistory);
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
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

  const handleClearHistory = async () => {
    await clearHistory();
    setHistory([]);
    setMessage("Analysis history cleared.");
  };

  const handleSaveToWatchlist = async (item) => {
    try {
      await addToWatchlist(item);
      setMessage(`${item.ticker} saved to Watchlist.`);
    } catch {
      setMessage("Unable to save stock to Watchlist.");
    }
  };

  const handleAnalyseAgain = async (item) => {
    setLoadingTicker(item.ticker);
    setMessage("");

    try {
      await analyzeStock(item.ticker, item.period || "1y");
      navigation.navigate("Analyze");
    } catch {
      setMessage(`Unable to analyse ${item.ticker} again.`);
    } finally {
      setLoadingTicker("");
    }
  };

  const highRiskCount = history.filter(
    (item) => item.risk_level === "High Risk"
  ).length;

  const mediumRiskCount = history.filter(
    (item) => item.risk_level === "Medium Risk"
  ).length;

  const lowRiskCount = history.filter(
    (item) => item.risk_level === "Low Risk"
  ).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.tag}>History</Text>
          <Text style={styles.title}>Analysis History</Text>
          <Text style={styles.description}>
            Review stocks recently analysed on your mobile device. This history
            is saved locally.
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>{history.length}</Text>
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

        {history.length > 0 ? (
          <Pressable style={styles.clearButton} onPress={handleClearHistory}>
            <Text style={styles.clearButtonText}>Clear History</Text>
          </Pressable>
        ) : null}

        {history.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No Analysis History Yet</Text>
            <Text style={styles.emptyText}>
              Go to the Analyze tab and analyse a stock. The result will appear
              here automatically.
            </Text>
          </View>
        ) : (
          <View style={styles.listSection}>
            {history.map((item) => (
              <View key={`${item.ticker}-${item.searched_at}`} style={styles.stockCard}>
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
                    <Text style={styles.metricLabel}>Period</Text>
                    <Text style={styles.metricValue}>{item.period || "1y"}</Text>
                  </View>
                </View>

                <Text style={styles.searchedAtText}>
                  Analysed at: {item.searched_at}
                </Text>

                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() => handleSaveToWatchlist(item)}
                  >
                    <Text style={styles.secondaryButtonText}>
                      Save to Watchlist
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.primaryButton}
                    onPress={() => handleAnalyseAgain(item)}
                    disabled={loadingTicker === item.ticker}
                  >
                    {loadingTicker === item.ticker ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.primaryButtonText}>Analyse Again</Text>
                    )}
                  </Pressable>
                </View>
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

  searchedAtText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
    marginBottom: 12,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  secondaryButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
  },

  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "900",
  },
});