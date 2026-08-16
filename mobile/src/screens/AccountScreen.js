import { useCallback, useState } from "react";
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
import { useFocusEffect } from "@react-navigation/native";

import {
  checkApiHealth,
  getCurrentUser,
  loginUser,
  registerUser,
} from "../api/finsightApi";
import {
  clearAuthToken,
  getAuthToken,
  saveAuthToken,
} from "../api/authStorage";
import { getWatchlist } from "../api/watchlistStorage";
import { colors } from "../theme/colors";

export default function AccountScreen() {
  const [apiStatus, setApiStatus] = useState("Checking...");
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [checkingApi, setCheckingApi] = useState(false);

  const [mode, setMode] = useState("status");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loadAccountStatus = async () => {
    const savedWatchlist = await getWatchlist();
    setWatchlistCount(savedWatchlist.length);

    const token = await getAuthToken();

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await getCurrentUser(token);
      setUser(currentUser);
    } catch {
      await clearAuthToken();
      setUser(null);
    }
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

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setAuthMessage("");
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setAuthMessage("Please enter your email and password.");
      return;
    }

    setAuthLoading(true);
    setAuthMessage("");

    try {
      const result = await loginUser(email.trim(), password.trim());

      await saveAuthToken(result.access_token);

      const currentUser = await getCurrentUser(result.access_token);
      setUser(currentUser);

      resetForm();
      setMode("status");
      setAuthMessage("Login successful.");
    } catch (error) {
      setAuthMessage(error.message || "Unable to login.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setAuthMessage("Please enter your name, email, and password.");
      return;
    }

    setAuthLoading(true);
    setAuthMessage("");

    try {
      await registerUser(name.trim(), email.trim(), password.trim());

      const loginResult = await loginUser(email.trim(), password.trim());
      await saveAuthToken(loginResult.access_token);

      const currentUser = await getCurrentUser(loginResult.access_token);
      setUser(currentUser);

      resetForm();
      setMode("status");
      setAuthMessage("Account created and logged in.");
    } catch (error) {
      setAuthMessage(error.message || "Unable to register account.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await clearAuthToken();
    setUser(null);
    setAuthMessage("Logged out successfully.");
    setMode("status");
  };

  const isApiConnected = apiStatus === "Connected";
  const isLoggedIn = Boolean(user);

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
            Login, register, check backend connection, and view mobile storage
            status.
          </Text>
        </View>

        <View style={styles.statusCard}>
          <View
            style={[
              styles.statusBadge,
              isLoggedIn
                ? styles.connectedBadge
                : isApiConnected
                ? styles.connectedBadge
                : styles.guestBadge,
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {isLoggedIn
                ? "Logged In"
                : isApiConnected
                ? "API Connected"
                : "Guest Mode"}
            </Text>
          </View>

          <Text style={styles.statusTitle}>
            {isLoggedIn
              ? `Welcome, ${user.full_name || user.name || user.email}`
              : "Using FinSight Mobile as guest"}
          </Text>

          <Text style={styles.statusText}>
            This mobile version currently saves watchlist, risk profile, and
            analysis history data locally on this device. Login is now available,
            and cloud sync can be added in the next phase.
          </Text>
        </View>

        {authMessage ? (
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>{authMessage}</Text>
          </View>
        ) : null}

        {!isLoggedIn && mode === "status" ? (
          <View style={styles.authButtonRow}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => {
                resetForm();
                setMode("login");
              }}
            >
              <Text style={styles.primaryButtonText}>Login</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => {
                resetForm();
                setMode("register");
              }}
            >
              <Text style={styles.secondaryButtonText}>Register</Text>
            </Pressable>
          </View>
        ) : null}

        {isLoggedIn && mode === "status" ? (
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Pressable>
        ) : null}

        {mode === "login" ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Login</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
            />

            <Pressable
              style={[styles.primaryButtonFull, authLoading && styles.disabled]}
              onPress={handleLogin}
              disabled={authLoading}
            >
              {authLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonText}>Login</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.textButton}
              onPress={() => {
                resetForm();
                setMode("status");
              }}
            >
              <Text style={styles.textButtonText}>Back to Account</Text>
            </Pressable>
          </View>
        ) : null}

        {mode === "register" ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Register</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
            />

            <Pressable
              style={[styles.primaryButtonFull, authLoading && styles.disabled]}
              onPress={handleRegister}
              disabled={authLoading}
            >
              {authLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonText}>Create Account</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.textButton}
              onPress={() => {
                resetForm();
                setMode("status");
              }}
            >
              <Text style={styles.textButtonText}>Back to Account</Text>
            </Pressable>
          </View>
        ) : null}

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
            <Text style={styles.summaryValue}>
              {isLoggedIn ? "Logged In" : "Guest"}
            </Text>
          </View>
        </View>

        <Pressable style={styles.refreshButton} onPress={checkBackendStatus}>
          <Text style={styles.refreshButtonText}>Refresh API Status</Text>
        </Pressable>

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

  authButtonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },

  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },

  secondaryButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900",
  },

  logoutButton: {
    backgroundColor: "#fef2f2",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#fecaca",
  },

  logoutButtonText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: "900",
  },

  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },

  formTitle: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
  },

  label: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.primary,
    marginBottom: 16,
  },

  primaryButtonFull: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },

  disabled: {
    opacity: 0.7,
  },

  textButton: {
    alignItems: "center",
    marginTop: 16,
  },

  textButtonText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "800",
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