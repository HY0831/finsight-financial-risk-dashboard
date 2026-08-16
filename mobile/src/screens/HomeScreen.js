import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAppTheme } from "../theme/ThemeContext";

export default function HomeScreen({ navigation }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.tag}>FinSight Mobile</Text>
          <Text style={styles.title}>
            Financial Risk Analysis in Your Pocket
          </Text>
          <Text style={styles.description}>
            Analyze stock risk, compare companies, track gold prices, save
            watchlists, and manage your investor risk profile.
          </Text>

          <Pressable
            style={styles.heroButton}
            onPress={() => navigation.navigate("Analyze")}
          >
            <Text style={styles.heroButtonText}>Start Analysis</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Main Features</Text>

          <View style={styles.cardGrid}>
            <FeatureCard
              title="Stock Analysis"
              description="Calculate return, volatility, maximum drawdown, and risk level."
              colors={colors}
            />

            <FeatureCard
              title="Stock Compare"
              description="Compare two stocks side by side using the same time period."
              colors={colors}
            />

            <FeatureCard
              title="Gold Dashboard"
              description="Track gold futures price trend and risk metrics."
              colors={colors}
            />

            <FeatureCard
              title="Cloud Storage"
              description="Save watchlist, history, and risk profile after login."
              colors={colors}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risk Metrics</Text>

          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Annualized Volatility</Text>
            <Text style={styles.metricText}>
              Measures how much the stock price moves in a year. Higher
              volatility means higher price movement.
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Maximum Drawdown</Text>
            <Text style={styles.metricText}>
              Shows the largest drop from a previous high price to a later low
              price during the selected period.
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Risk Level</Text>
            <Text style={styles.metricText}>
              FinSight classifies stocks as Low Risk, Medium Risk, or High Risk
              based on annualized volatility.
            </Text>
          </View>
        </View>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>Educational Use Only</Text>
          <Text style={styles.noticeText}>
            FinSight is created for learning and portfolio demonstration. It
            does not provide financial advice or investment recommendations.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureCard({ title, description, colors }) {
  const styles = createStyles(colors);

  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureText}>{description}</Text>
    </View>
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
      borderRadius: 26,
      padding: 26,
      marginBottom: 24,
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
      fontSize: 30,
      fontWeight: "900",
      lineHeight: 38,
      marginBottom: 12,
    },

    description: {
      color: colors.heroMuted,
      fontSize: 15,
      lineHeight: 24,
      marginBottom: 20,
    },

    heroButton: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: "center",
    },

    heroButtonText: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: "900",
    },

    section: {
      marginBottom: 24,
    },

    sectionTitle: {
      color: colors.primary,
      fontSize: 22,
      fontWeight: "900",
      marginBottom: 14,
    },

    cardGrid: {
      gap: 14,
    },

    featureCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
    },

    featureTitle: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: "900",
      marginBottom: 8,
    },

    featureText: {
      color: colors.muted,
      fontSize: 14,
      lineHeight: 22,
    },

    metricCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },

    metricTitle: {
      color: colors.primary,
      fontSize: 17,
      fontWeight: "900",
      marginBottom: 8,
    },

    metricText: {
      color: colors.muted,
      fontSize: 14,
      lineHeight: 22,
    },

    noticeCard: {
      backgroundColor: colors.noteBackground,
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.noteBorder,
    },

    noticeTitle: {
      color: colors.warning,
      fontSize: 17,
      fontWeight: "900",
      marginBottom: 8,
    },

    noticeText: {
      color: colors.secondary,
      fontSize: 14,
      lineHeight: 22,
    },
  });
}