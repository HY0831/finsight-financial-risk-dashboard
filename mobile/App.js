import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./src/screens/HomeScreen";
import AnalyzeScreen from "./src/screens/AnalyzeScreen";
import CompareScreen from "./src/screens/CompareScreen";
import GoldScreen from "./src/screens/GoldScreen";
import WatchlistScreen from "./src/screens/WatchlistScreen";
import AccountScreen from "./src/screens/AccountScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTitleStyle: {
            color: "#111827",
            fontWeight: "900",
          },
          tabBarActiveTintColor: "#111827",
          tabBarInactiveTintColor: "#6b7280",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopColor: "#e5e7eb",
            height: 72,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "700",
          },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Analyze" component={AnalyzeScreen} />
        <Tab.Screen name="Gold" component={GoldScreen} />
        <Tab.Screen name="Watchlist" component={WatchlistScreen} />
        <Tab.Screen name="Compare" component={CompareScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}