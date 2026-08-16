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
import { getRiskProfile } from "../api/riskProfileStorage";
import { getHistory } from "../api/historyStorage";
import { useAppTheme } from "../theme/ThemeContext";

export default function AccountScreen() {
  const { theme, colors, setTheme } = useAppTheme();
  const styles = createStyles(colors);

  const [apiStatus, setApiStatus] = useState("Checking...");
  const [user, setUser] = useState(null);
  const [storageMode, setStorageMode] = useState("Local");
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const [riskProfileStatus, setRiskProfileStatus] = useState("Not completed");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadAccountData = async () => {
    setMessage("");

    try {
      const health = await checkApiHealth();

      if (health.status === "ok") {
        setApiStatus("Connected");
      } else {
        setApiStatus("Available");
      }
    } catch {
      setApiStatus("Disconnected");
    }

    try {
      const token = await getAuthToken();

      if (token) {
        const currentUser = await getCurrentUser(token);

        setUser(currentUser);
        setStorageMode("Cloud");
      } else {
        setUser(null);
        setStorageMode("Local");
      }
    } catch (error) {
      console.log("Load current user error:", error);

      await clearAuthToken();
      setUser(null);
      setStorageMode("Local");
    }

    try {
      const savedWatchlist = await getWatchlist();
      const savedHistory = await getHistory();
      const savedRiskProfile = await getRiskProfile();

      setWatchlistCount(savedWatchlist.length);
      setHistoryCount(savedHistory.length);
      setRiskProfileStatus(savedRiskProfile ? "Completed" : "Not completed");
    } catch (error) {
      console.log("Load local storage summary error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAccountData();
    }, [])
  );

  const handleLogin = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setMessage("Please enter email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await loginUser(loginEmail.trim(), loginPassword);

      await saveAuthToken(result.access_token);

      const currentUser = await getCurrentUser(result.access_token);

      setUser(currentUser);
      setStorageMode("Cloud");
      setLoginEmail("");
      setLoginPassword("");
      setMessage("Login successful. Cloud save is now enabled.");
    } catch (error) {
      console.log("Login error:", error);
      setMessage(error.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (
      !registerName.trim() ||
      !registerEmail.trim() ||
      !registerPassword.trim()
    ) {
      setMessage("Please enter name, email, and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await registerUser(
        registerName.trim(),
        registerEmail.trim(),
        registerPassword
      );

      const result = await loginUser(registerEmail.trim(), registerPassword);

      await saveAuthToken(result.access_token);

      const currentUser = await getCurrentUser(result.access_token);

      setUser(currentUser);
      setStorageMode("Cloud");
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setMessage("Registration successful. Cloud save is now enabled.");
    } catch (error) {
      console.log("Register error:", error);
      setMessage(error.message || "Unable to register account.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await clearAuthToken();

    setUser(null);
    setStorageMode("Local");
    setMessage("Logged out. Guest mode is now using local storage.");
  };

  const themeOptions = [
    {
      label: "Light",
      value: "light",
      description: "Clean bright dashboard style.",
    },
    {
      label: "Dark",
      value: "dark",
      description: "Dark background for low-light use.",
    },
    {
      label: "Eye Protection",
      value: "eye",
      description: "Soft green tone for comfortable viewing.",
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <Text style={styles.tag}>Account</Text>
          <Text style={styles.title}>Account & App Settings</Text>
          <Text style={styles.description}>
            Manage login status, cloud storage, backend connection, and mobile
            theme preference.
          </Text>
        </View>

        <View style={styles.statusGrid}>
          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>Backend API</Text>
            <Text style={styles.statusValue}>{apiStatus}</Text>
          </View>

          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>Storage Mode</Text>
            <Text style={styles.statusValue}>{storageMode}</Text>
          </View>

          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>Local Watchlist</Text>
            <Text style={styles.statusValue}>{watchlistCount}</Text>
          </View>

          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>Local History</Text>
            <Text style={styles.statusValue}>{historyCount}</Text>
          </View>
        </View>

        <View style={styles.themeCard}>
          <Text style={styles.sectionTitle}>App Theme</Text>
          <Text style={styles.sectionDescription}>
            Choose the visual mode for the mobile app.
          </Text>

          <View style={styles.themeOptionList}>
            {themeOptions.map((item) => {
              const isSelected = theme === item.value;

              return (
                <Pressable
                  key={item.value}
                  style={[
                    styles.themeOption,
                    isSelected && styles.themeOptionSelected,
                  ]}
                  onPress={() => setTheme(item.value)}
                >
                  <View>
                    <Text
                      style={[
                        styles.themeOptionTitle,
                        isSelected && styles.themeOptionTitleSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={[
                        styles.themeOptionDescription,
                        isSelected && styles.themeOptionDescriptionSelected,
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.themeCheck,
                      isSelected && styles.themeCheckSelected,
                    ]}
                  >
                    {isSelected ? "✓" : ""}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.accountCard}>
          <Text style={styles.sectionTitle}>Login Status</Text>

          {user ? (
            <>
              <Text style={styles.userText}>
                Welcome, {user.full_name || user.name || user.email}
              </Text>

              <Text style={styles.userSubText}>{user.email}</Text>

              <Text style={styles.infoText}>
                Your watchlist, analysis history, and risk profile can be saved
                to cloud database when logged in.
              </Text>

              <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.infoText}>
                You are currently using guest mode. Guest data is saved locally
                on this device only.
              </Text>
            </>
          )}
        </View>

        <View style={styles.statusCardFull}>
          <Text style={styles.sectionTitle}>Risk Profile Status</Text>
          <Text style={styles.statusValueLarge}>{riskProfileStatus}</Text>
        </View>

        {!user ? (
          <>
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Login</Text>

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                value={loginEmail}
                onChangeText={setLoginEmail}
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.muted}
                secureTextEntry
                value={loginPassword}
                onChangeText={setLoginPassword}
              />

              <Pressable
                style={[styles.primaryButton, loading && styles.disabledButton]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Loading..." : "Login"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Register</Text>

              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={colors.muted}
                value={registerName}
                onChangeText={setRegisterName}
              />

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                value={registerEmail}
                onChangeText={setRegisterEmail}
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.muted}
                secureTextEntry
                value={registerPassword}
                onChangeText={setRegisterPassword}
              />

              <Pressable
                style={[styles.primaryButton, loading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Loading..." : "Register"}
                </Text>
              </Pressable>
            </View>
          </>
        ) : null}

        {message ? (
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        ) : null}

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Storage Explanation</Text>
          <Text style={styles.noteText}>
            Local mode stores data only on this device. Cloud mode stores user
            data in the backend database after login.
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

    statusGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 18,
    },

    statusCard: {
      width: "48%",
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },

    statusLabel: {
      color: colors.muted,
      fontSize: 12,
      fontWeight: "700",
      marginBottom: 8,
    },

    statusValue: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: "900",
    },

    themeCard: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 18,
    },

    sectionTitle: {
      color: colors.primary,
      fontSize: 20,
      fontWeight: "900",
      marginBottom: 8,
    },

    sectionDescription: {
      color: colors.muted,
      fontSize: 14,
      lineHeight: 21,
      marginBottom: 14,
    },

    themeOptionList: {
      gap: 10,
    },

    themeOption: {
      backgroundColor: colors.inputBackground,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
    },

    themeOptionSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    themeOptionTitle: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: "900",
      marginBottom: 4,
    },

    themeOptionTitleSelected: {
      color: colors.surface,
    },

    themeOptionDescription: {
      color: colors.muted,
      fontSize: 13,
      lineHeight: 19,
      maxWidth: 250,
    },

    themeOptionDescriptionSelected: {
      color: colors.surface,
      opacity: 0.85,
    },

    themeCheck: {
      color: colors.primary,
      fontSize: 22,
      fontWeight: "900",
    },

    themeCheckSelected: {
      color: colors.surface,
    },

    accountCard: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 18,
    },

    userText: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: "900",
      marginBottom: 4,
    },

    userSubText: {
      color: colors.muted,
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 12,
    },

    infoText: {
      color: colors.muted,
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 14,
    },

    logoutButton: {
      backgroundColor: colors.danger,
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: "center",
    },

    logoutButtonText: {
      color: "#ffffff",
      fontSize: 15,
      fontWeight: "900",
    },

    statusCardFull: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 18,
    },

    statusValueLarge: {
      color: colors.primary,
      fontSize: 24,
      fontWeight: "900",
    },

    formCard: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 18,
      gap: 12,
    },

    input: {
      backgroundColor: colors.inputBackground,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      paddingVertical: 13,
      color: colors.primary,
      fontSize: 15,
      fontWeight: "700",
    },

    primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 15,
      alignItems: "center",
      marginTop: 4,
    },

    primaryButtonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: "900",
    },

    disabledButton: {
      opacity: 0.6,
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

    noteCard: {
      backgroundColor: colors.noteBackground,
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.noteBorder,
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