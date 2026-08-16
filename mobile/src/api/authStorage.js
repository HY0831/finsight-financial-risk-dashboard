import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "finsightMobileAuthToken";

export async function saveAuthToken(token) {
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function getAuthToken() {
  return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

export async function clearAuthToken() {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}