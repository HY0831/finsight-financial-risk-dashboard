import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.tag}>Account</Text>
          <Text style={styles.title}>FinSight Account</Text>
          <Text style={styles.text}>
            This screen will later include login, register, account status,
            storage mode, risk profile, and history access.
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
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tag: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 10,
  },
  text: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
  },
});