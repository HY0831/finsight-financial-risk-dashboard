import AsyncStorage from "@react-native-async-storage/async-storage";

const RISK_PROFILE_KEY = "finsightMobileRiskProfile";
const RISK_ANSWERS_KEY = "finsightMobileRiskAnswers";

export async function getRiskProfile() {
  const savedProfile = await AsyncStorage.getItem(RISK_PROFILE_KEY);
  return savedProfile ? JSON.parse(savedProfile) : null;
}

export async function saveRiskProfile(profile) {
  await AsyncStorage.setItem(RISK_PROFILE_KEY, JSON.stringify(profile));
}

export async function getRiskAnswers() {
  const savedAnswers = await AsyncStorage.getItem(RISK_ANSWERS_KEY);
  return savedAnswers ? JSON.parse(savedAnswers) : {};
}

export async function saveRiskAnswers(answers) {
  await AsyncStorage.setItem(RISK_ANSWERS_KEY, JSON.stringify(answers));
}

export async function clearRiskProfile() {
  await AsyncStorage.removeItem(RISK_PROFILE_KEY);
  await AsyncStorage.removeItem(RISK_ANSWERS_KEY);
}