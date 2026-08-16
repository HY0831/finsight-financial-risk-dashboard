import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEME_KEY = "finsightMobileTheme";

const themeColors = {
  light: {
    mode: "light",
    background: "#f3f4f6",
    surface: "#ffffff",
    primary: "#111827",
    secondary: "#374151",
    muted: "#6b7280",
    border: "#e5e7eb",
    inputBackground: "#f9fafb",
    success: "#166534",
    warning: "#92400e",
    danger: "#991b1b",
    heroBackground: "#111827",
    heroText: "#ffffff",
    heroMuted: "#e5e7eb",
    messageBackground: "#ecfdf5",
    messageBorder: "#bbf7d0",
    errorBackground: "#fef2f2",
    errorBorder: "#fecaca",
    noteBackground: "#fffbeb",
    noteBorder: "#fde68a",
  },

  dark: {
    mode: "dark",
    background: "#020617",
    surface: "#0f172a",
    primary: "#f9fafb",
    secondary: "#e5e7eb",
    muted: "#94a3b8",
    border: "#334155",
    inputBackground: "#1e293b",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
    heroBackground: "#0f172a",
    heroText: "#ffffff",
    heroMuted: "#cbd5e1",
    messageBackground: "#052e16",
    messageBorder: "#166534",
    errorBackground: "#450a0a",
    errorBorder: "#991b1b",
    noteBackground: "#422006",
    noteBorder: "#92400e",
  },

  eye: {
    mode: "eye",
    background: "#edf6e5",
    surface: "#fbfff7",
    primary: "#233322",
    secondary: "#3f5138",
    muted: "#64745d",
    border: "#cfe2c1",
    inputBackground: "#f7fbf2",
    success: "#2f6b3f",
    warning: "#8a5a16",
    danger: "#9b2c2c",
    heroBackground: "#315f34",
    heroText: "#ffffff",
    heroMuted: "#e7f3df",
    messageBackground: "#eef8e8",
    messageBorder: "#b8d8a8",
    errorBackground: "#fceeee",
    errorBorder: "#efb3b3",
    noteBackground: "#fff8dc",
    noteBorder: "#ead28a",
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);

        if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "eye") {
          setThemeState(savedTheme);
        }
      } catch (error) {
        console.log("Load theme error:", error);
      }
    }

    loadTheme();
  }, []);

  const setTheme = async (newTheme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
      console.log("Save theme error:", error);
    }
  };

  const value = useMemo(
    () => ({
      theme,
      colors: themeColors[theme],
      setTheme,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used inside ThemeProvider");
  }

  return context;
}