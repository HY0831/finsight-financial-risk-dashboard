import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./src/screens/HomeScreen";
import AnalyzeScreen from "./src/screens/AnalyzeScreen";
import CompareScreen from "./src/screens/CompareScreen";
import GoldScreen from "./src/screens/GoldScreen";
import WatchlistScreen from "./src/screens/WatchlistScreen";
import RiskProfileScreen from "./src/screens/RiskProfileScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import AccountScreen from "./src/screens/AccountScreen";
import { ThemeProvider, useAppTheme } from "./src/theme/ThemeContext";

const Tab = createBottomTabNavigator();

function getTabIcon(routeName, focused) {
  if (routeName === "Home") return focused ? "home" : "home-outline";
  if (routeName === "Analyze") return focused ? "analytics" : "analytics-outline";
  if (routeName === "Compare") return focused ? "git-compare" : "git-compare-outline";
  if (routeName === "Gold") return focused ? "diamond" : "diamond-outline";
  if (routeName === "Watchlist") return focused ? "bookmark" : "bookmark-outline";
  if (routeName === "Profile") return focused ? "person-circle" : "person-circle-outline";
  if (routeName === "History") return focused ? "time" : "time-outline";
  if (routeName === "Account") return focused ? "settings" : "settings-outline";

  return focused ? "ellipse" : "ellipse-outline";
}

function AppNavigator() {
  const { colors } = useAppTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTitleStyle: {
            color: colors.primary,
            fontWeight: "900",
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 66,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = getTabIcon(route.name, focused);

            return <Ionicons name={iconName} size={size + 3} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Analyze" component={AnalyzeScreen} />
        <Tab.Screen name="Compare" component={CompareScreen} />
        <Tab.Screen name="Gold" component={GoldScreen} />
        <Tab.Screen name="Watchlist" component={WatchlistScreen} />
        <Tab.Screen name="Profile" component={RiskProfileScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}