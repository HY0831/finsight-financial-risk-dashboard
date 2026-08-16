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

import { checkApiHealth } from "../api/finsightApi";
import { getWatchlist } from "../api/watchlistStorage";
import { colors } from "../theme/colors";

export default function AccountScreen() {
  const [apiStatus, setApiStatus] = useState("Checking...");
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [checkingApi, setCheckingApi] = useState(false);

  const loadAccountStatus = async () => {
    const savedWatchlist = await getWatchlist();
    setWatchlistCount(savedWatchlist.length);
  };

  const checkBackendStatus = async () => {
    setCheckingApi(true);
    setApiStatus("Checking...");

    try {
      const result = await checkApiHealth();

      if (result.status === "ok") {
        setApiStatus("Connected");
      } else {
        setApiStatus("Unavailable");
      }
    } catch {
      setApiStatus("Unavailable");
    } finally {
      setCheckingApi(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAccountStatus();
      checkBackendStatus();
    }, [])
  );

  const isApiConnected = apiStatus === "Connected";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.tag}>Account</Text>
          <Text style={styles.title}>FinSight Mobile Account</Text>
          <Text style={styles.description}>
            View mobile app storage mode, backend connection status, and saved
            activity summary.
          </Text>
        </View>

        <View style={styles.statusCard}>
          <View
            style={[
              styles.statusBadge,
              isApiConnected ? styles.connectedBadge : styles.guestBadge,
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {isApiConnected ? "API Connected" : "Guest Mode"}
            </Text>
          </View>

          <Text style={styles.statusTitle}>
            {isApiConnected
              ? "FinSight backend is connected"
              : "Using local mobile storage"}
          </Text>

          <Text style={styles.statusText}>
            This mobile version currently saves watchlist, risk profile, and
            analysis history data locally on this device. Login and cloud
            database storage can be added in the next phase.
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Backend API</Text>

            {checkingApi ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text
                style={[
                  styles.summaryValue,
                  isApiConnected
                    ? styles.connectedText
                    : styles.unavailableText,
                ]}
              >
                {apiStatus}
              </Text>
            )}
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Storage Mode</Text>
            <Text style={styles.summaryValue}>Local</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Saved Watchlist</Text>
            <Text style={styles.summaryValue}>{watchlistCount}</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Login Status</Text>
            <Text style={styles.summaryValue}>Guest</Text>
          </View>
        </View>

        <Pressable style={styles.refreshButton} onPress={checkBackendStatus}>
          <Text style={styles.refreshButtonText}>Refresh API Status</Text>
        </Pressable>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Current Mobile Features</Text>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>✅</Text>
            <Text style={styles.featureText}>Home dashboard overview</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>✅</Text>
            <Text style={styles.featureText}>Stock risk analysis API</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>✅</Text>
            <Text style={styles.featureText}>Gold price dashboard API</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>✅</Text>
            <Text style={styles.featureText}>Stock comparison screen</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>✅</Text>
            <Text style={styles.featureText}>Risk profile questionnaire</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>✅</Text>
            <Text style={styles.featureText}>Local watchlist storage</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>✅</Text>
            <Text style={styles.featureText}>Local analysis history</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>✅</Text>
            <Text style={styles.featureText}>Simple mobile line charts</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Future Mobile Features</Text>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>⬜</Text>
            <Text style={styles.featureText}>Login and registration</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>⬜</Text>
            <Text style={styles.featureText}>Cloud watchlist storage</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>⬜</Text>
            <Text style={styles.featureText}>Cloud risk profile storage</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>⬜</Text>
            <Text style={styles.featureText}>Cloud analysis history storage</Text>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Educational Use Only</Text>
          <Text style={styles.noteText}>
            FinSight Mobile is built for learning and portfolio demonstration.
            It does not provide financial advice or investment recommendations.
          </Text>
        </View>
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

  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },

  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  connectedBadge: {
    backgroundColor: colors.success,
  },

  guestBadge: {
    backgroundColor: colors.secondary,
  },

  statusBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
  },

  statusTitle: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 8,
  },

  statusText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
  },

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18,
  },

  summaryCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
    justifyContent: "center",
  },

  summaryLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },

  summaryValue: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: "900",
  },

  connectedText: {
    color: colors.success,
  },

  unavailableText: {
    color: colors.danger,
  },

  refreshButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 18,
  },

  refreshButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },

  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },

  featureRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    marginBottom: 12,
  },

  featureIcon: {
    fontSize: 18,
    width: 24,
  },

  featureText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
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