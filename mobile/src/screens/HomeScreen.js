import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../theme/colors";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.tag}>FinSight Mobile</Text>

          <Text style={styles.title}>
            AI-Powered Financial Risk Dashboard
          </Text>

          <Text style={styles.description}>
            Analyse stock risk, compare assets, track gold price trends, and
            understand financial risk using simple metrics and charts.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Main Features</Text>
          <Text style={styles.sectionText}>
            FinSight Mobile brings the core features of the web dashboard into a
            simple mobile experience.
          </Text>

          <View style={styles.featureGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>📈</Text>
              <Text style={styles.featureTitle}>Stock Analysis</Text>
              <Text style={styles.featureText}>
                Check stock price, volatility, annualized volatility, risk
                level, and maximum drawdown.
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🥇</Text>
              <Text style={styles.featureTitle}>Gold Price</Text>
              <Text style={styles.featureText}>
                Track gold futures price, historical trend, volatility, and
                drawdown.
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>⭐</Text>
              <Text style={styles.featureTitle}>Watchlist</Text>
              <Text style={styles.featureText}>
                Save analysed assets for easier monitoring and future review.
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>👤</Text>
              <Text style={styles.featureTitle}>Risk Profile</Text>
              <Text style={styles.featureText}>
                Understand your personal risk tolerance using a simple
                questionnaire.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risk Metrics</Text>

          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Annualized Volatility</Text>
            <Text style={styles.metricText}>
              Measures how much the asset price may move in one year based on
              historical daily returns.
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Maximum Drawdown</Text>
            <Text style={styles.metricText}>
              Shows the largest peak-to-bottom loss during the selected period.
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Risk Level</Text>
            <Text style={styles.metricText}>
              Classifies assets into Low Risk, Medium Risk, or High Risk to make
              the result easier to understand.
            </Text>
          </View>
        </View>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>Educational Use Only</Text>
          <Text style={styles.noticeText}>
            FinSight is built for learning and portfolio demonstration. It does
            not provide financial advice or investment recommendations.
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
    padding: 26,
    marginBottom: 20,
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
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 38,
    marginBottom: 12,
  },

  description: {
    color: "#e5e7eb",
    fontSize: 15,
    lineHeight: 23,
  },

  section: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
  },

  sectionText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },

  featureGrid: {
    gap: 12,
  },

  featureCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  featureIcon: {
    fontSize: 26,
    marginBottom: 8,
  },

  featureTitle: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6,
  },

  featureText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },

  metricCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
  },

  metricTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },

  metricText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },

  noticeCard: {
    backgroundColor: "#fffbeb",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#fde68a",
  },

  noticeTitle: {
    color: colors.warning,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },

  noticeText: {
    color: "#78350f",
    fontSize: 14,
    lineHeight: 21,
  },
});