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

const Tab = createBottomTabNavigator();

function getTabIcon(routeName, focused) {
  if (routeName === "Home") {
    return focused ? "home" : "home-outline";
  }

  if (routeName === "Analyze") {
    return focused ? "analytics" : "analytics-outline";
  }

  if (routeName === "Compare") {
    return focused ? "git-compare" : "git-compare-outline";
  }

  if (routeName === "Gold") {
    return focused ? "diamond" : "diamond-outline";
  }

  if (routeName === "Watchlist") {
    return focused ? "bookmark" : "bookmark-outline";
  }

  if (routeName === "Profile") {
    return focused ? "person-circle" : "person-circle-outline";
  }

  if (routeName === "History") {
    return focused ? "time" : "time-outline";
  }

  if (routeName === "Account") {
    return focused ? "settings" : "settings-outline";
  }

  return focused ? "ellipse" : "ellipse-outline";
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTitleStyle: {
            color: "#111827",
            fontWeight: "900",
          },
          tabBarActiveTintColor: "#111827",
          tabBarInactiveTintColor: "#9ca3af",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopColor: "#e5e7eb",
            height: 66,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = getTabIcon(route.name, focused);

            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
              />
            );
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