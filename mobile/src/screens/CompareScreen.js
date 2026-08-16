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

import { analyzeStock, searchStocks } from "../api/finsightApi";
import { colors } from "../theme/colors";

const periodOptions = [
  { label: "6M", value: "6mo" },
  { label: "1Y", value: "1y" },
  { label: "3Y", value: "3y" },
  { label: "5Y", value: "5y" },
];

export default function CompareScreen() {
  const [firstTicker, setFirstTicker] = useState("");
  const [secondTicker, setSecondTicker] = useState("");
  const [period, setPeriod] = useState("1y");

  const [firstSuggestions, setFirstSuggestions] = useState([]);
  const [secondSuggestions, setSecondSuggestions] = useState([]);
  const [firstSearchLoading, setFirstSearchLoading] = useState(false);
  const [secondSearchLoading, setSecondSearchLoading] = useState(false);
  const [activeSearchBox, setActiveSearchBox] = useState(null);

  const [firstStock, setFirstStock] = useState(null);
  const [secondStock, setSecondStock] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const searchText = firstTicker.trim();

    if (activeSearchBox !== "first") {
      return;
    }

    if (searchText.length < 2) {
      setFirstSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setFirstSearchLoading(true);

        const data = await searchStocks(searchText);
        const results = Array.isArray(data.results) ? data.results : [];

        setFirstSuggestions(results);
      } catch (searchError) {
        console.log("First stock suggestion error:", searchError);
        setFirstSuggestions([]);
      } finally {
        setFirstSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [firstTicker, activeSearchBox]);

  useEffect(() => {
    const searchText = secondTicker.trim();

    if (activeSearchBox !== "second") {
      return;
    }

    if (searchText.length < 2) {
      setSecondSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setSecondSearchLoading(true);

        const data = await searchStocks(searchText);
        const results = Array.isArray(data.results) ? data.results : [];

        setSecondSuggestions(results);
      } catch (searchError) {
        console.log("Second stock suggestion error:", searchError);
        setSecondSuggestions([]);
      } finally {
        setSecondSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [secondTicker, activeSearchBox]);

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

  const handleSelectFirstSuggestion = (item) => {
    setFirstTicker(item.ticker);
    setFirstSuggestions([]);
    setActiveSearchBox(null);
    setError("");
  };

  const handleSelectSecondSuggestion = (item) => {
    setSecondTicker(item.ticker);
    setSecondSuggestions([]);
    setActiveSearchBox(null);
    setError("");
  };

  const handleCompare = async () => {
    const cleanFirstTicker = firstTicker.trim().toUpperCase();
    const cleanSecondTicker = secondTicker.trim().toUpperCase();

    if (!cleanFirstTicker || !cleanSecondTicker) {
      setError("Please enter two stock tickers to compare.");
      return;
    }

    if (cleanFirstTicker === cleanSecondTicker) {
      setError("Please enter two different stocks.");
      return;
    }

    setLoading(true);
    setError("");
    setFirstStock(null);
    setSecondStock(null);
    setFirstSuggestions([]);
    setSecondSuggestions([]);
    setActiveSearchBox(null);

    try {
      const [firstResult, secondResult] = await Promise.all([
        analyzeStock(cleanFirstTicker, period),
        analyzeStock(cleanSecondTicker, period),
      ]);

      setFirstStock(firstResult);
      setSecondStock(secondResult);
    } catch (compareError) {
      console.log("Compare error:", compareError);
      setError(compareError.message || "Unable to compare stocks.");
    } finally {
      setLoading(false);
    }
  };

  const getLowerRiskStock = () => {
    if (!firstStock || !secondStock) {
      return null;
    }

    if (
      Number(firstStock.annualized_volatility) <
      Number(secondStock.annualized_volatility)
    ) {
      return firstStock;
    }

    if (
      Number(secondStock.annualized_volatility) <
      Number(firstStock.annualized_volatility)
    ) {
      return secondStock;
    }

    return null;
  };

  const getHigherReturnStock = () => {
    if (!firstStock || !secondStock) {
      return null;
    }

    if (
      Number(firstStock.average_daily_return) >
      Number(secondStock.average_daily_return)
    ) {
      return firstStock;
    }

    if (
      Number(secondStock.average_daily_return) >
      Number(firstStock.average_daily_return)
    ) {
      return secondStock;
    }

    return null;
  };

  const lowerRiskStock = getLowerRiskStock();
  const higherReturnStock = getHigherReturnStock();

  const renderSuggestionBox = (suggestions, onSelect) => {
    if (!suggestions || suggestions.length === 0) {
      return null;
    }

    return (
      <View style={styles.suggestionBox}>
        {suggestions.map((item) => (
          <Pressable
            key={`${item.ticker}-${item.exchange}`}
            style={styles.suggestionItem}
            onPress={() => onSelect(item)}
          >
            <View>
              <Text style={styles.suggestionTicker}>{item.ticker}</Text>
              <Text style={styles.suggestionName}>{item.name || "N/A"}</Text>
            </View>

            <Text style={styles.suggestionExchange}>
              {item.exchange || "N/A"}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  const renderStockCard = (stock) => {
    if (!stock) {
      return null;
    }

    return (
      <View style={styles.stockCard}>
        <Text style={styles.stockTicker}>{stock.ticker}</Text>
        <Text style={styles.companyName}>{stock.company_name || "N/A"}</Text>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Latest Price</Text>
          <Text style={styles.metricValue}>{formatMoney(stock.latest_price)}</Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Average Daily Return</Text>
          <Text style={styles.metricValue}>
            {formatPercent(stock.average_daily_return)}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Annual Volatility</Text>
          <Text style={styles.metricValue}>
            {formatPercent(stock.annualized_volatility)}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Maximum Drawdown</Text>
          <Text style={styles.metricValue}>
            {formatPercent(stock.maximum_drawdown)}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Risk Level</Text>
          <Text style={styles.metricValue}>{stock.risk_level}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <Text style={styles.tag}>Compare</Text>
          <Text style={styles.title}>Compare Two Stocks</Text>
          <Text style={styles.description}>
            Search by ticker or company name. Compare volatility, return,
            maximum drawdown, and risk level side by side.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>First Stock</Text>

          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Example: AAP, Apple"
              placeholderTextColor="#9ca3af"
              value={firstTicker}
              autoCapitalize="characters"
              onFocus={() => setActiveSearchBox("first")}
              onChangeText={(value) => {
                setFirstTicker(value);
                setActiveSearchBox("first");
                setError("");
              }}
            />

            {firstSearchLoading && activeSearchBox === "first" ? (
              <View style={styles.searchLoadingRow}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.searchLoadingText}>Searching...</Text>
              </View>
            ) : null}

            {activeSearchBox === "first"
              ? renderSuggestionBox(
                  firstSuggestions,
                  handleSelectFirstSuggestion
                )
              : null}
          </View>

          <Text style={styles.label}>Second Stock</Text>

          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Example: TSLA, Tesla"
              placeholderTextColor="#9ca3af"
              value={secondTicker}
              autoCapitalize="characters"
              onFocus={() => setActiveSearchBox("second")}
              onChangeText={(value) => {
                setSecondTicker(value);
                setActiveSearchBox("second");
                setError("");
              }}
            />

            {secondSearchLoading && activeSearchBox === "second" ? (
              <View style={styles.searchLoadingRow}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.searchLoadingText}>Searching...</Text>
              </View>
            ) : null}

            {activeSearchBox === "second"
              ? renderSuggestionBox(
                  secondSuggestions,
                  handleSelectSecondSuggestion
                )
              : null}
          </View>

          <Text style={styles.label}>Comparison Period</Text>

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
            style={[styles.compareButton, loading && styles.disabledButton]}
            onPress={handleCompare}
            disabled={loading}
          >
            <Text style={styles.compareButtonText}>
              {loading ? "Comparing..." : "Compare Stocks"}
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
            <Text style={styles.loadingText}>Loading comparison...</Text>
          </View>
        ) : null}

        {firstStock && secondStock ? (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Comparison Result</Text>

            {renderStockCard(firstStock)}
            {renderStockCard(secondStock)}

            <View style={styles.summaryCard}>
              <Text style={styles.sectionTitle}>Comparison Summary</Text>

              <Text style={styles.summaryText}>
                Lower Risk Stock:{" "}
                <Text style={styles.boldText}>
                  {lowerRiskStock ? lowerRiskStock.ticker : "Both are similar"}
                </Text>
              </Text>

              <Text style={styles.summaryText}>
                Higher Average Return:{" "}
                <Text style={styles.boldText}>
                  {higherReturnStock
                    ? higherReturnStock.ticker
                    : "Both are similar"}
                </Text>
              </Text>

              <Text style={styles.summaryNote}>
                This comparison is based on historical price movement during the
                selected period. It is for educational purposes only and should
                not be treated as financial advice.
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

  compareButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.6,
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

  sectionTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4,
  },

  stockCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  stockTicker: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 4,
  },

  companyName: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 14,
  },

  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginTop: 10,
  },

  metricLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },

  metricValue: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
    flex: 1,
  },

  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  summaryText: {
    color: colors.secondary,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
  },

  boldText: {
    color: colors.primary,
    fontWeight: "900",
  },

  summaryNote: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
  },
});