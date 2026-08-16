import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  clearCloudRiskProfile,
  getCloudRiskProfile,
  saveCloudRiskProfile,
} from "../api/finsightApi";
import { getAuthToken } from "../api/authStorage";
import {
  clearRiskProfile,
  getRiskAnswers,
  getRiskProfile,
  saveRiskAnswers,
  saveRiskProfile,
} from "../api/riskProfileStorage";
import { colors } from "../theme/colors";

const riskQuestions = [
  {
    id: "objective",
    question: "What is your main investment objective?",
    options: [
      { label: "Protect my money", score: 1 },
      { label: "Earn stable income", score: 2 },
      { label: "Balanced income and growth", score: 3 },
      { label: "Long-term growth", score: 4 },
      { label: "High growth even with higher risk", score: 5 },
    ],
  },
  {
    id: "horizon",
    question: "How long do you plan to invest?",
    options: [
      { label: "Less than 1 year", score: 1 },
      { label: "1 to 2 years", score: 2 },
      { label: "3 to 5 years", score: 3 },
      { label: "6 to 10 years", score: 4 },
      { label: "More than 10 years", score: 5 },
    ],
  },
  {
    id: "moneyNeed",
    question: "How soon might you need this money?",
    options: [
      { label: "Very soon", score: 1 },
      { label: "Within 1 year", score: 2 },
      { label: "Within 3 years", score: 3 },
      { label: "After 5 years", score: 4 },
      { label: "I do not expect to need it soon", score: 5 },
    ],
  },
  {
    id: "lossReaction",
    question: "How would you react if your investment dropped by 20%?",
    options: [
      { label: "Sell immediately", score: 1 },
      { label: "Feel very worried", score: 2 },
      { label: "Wait and monitor", score: 3 },
      { label: "Hold for long term", score: 4 },
      { label: "Consider buying more", score: 5 },
    ],
  },
  {
    id: "priceMovement",
    question: "How comfortable are you with short-term price movement?",
    options: [
      { label: "Not comfortable at all", score: 1 },
      { label: "Slightly comfortable", score: 2 },
      { label: "Moderately comfortable", score: 3 },
      { label: "Comfortable", score: 4 },
      { label: "Very comfortable", score: 5 },
    ],
  },
  {
    id: "knowledge",
    question: "How would you describe your investment knowledge?",
    options: [
      { label: "Beginner", score: 1 },
      { label: "Basic knowledge", score: 2 },
      { label: "Some experience", score: 3 },
      { label: "Experienced", score: 4 },
      { label: "Very experienced", score: 5 },
    ],
  },
  {
    id: "stability",
    question: "How stable is your current financial situation?",
    options: [
      { label: "Very unstable", score: 1 },
      { label: "Somewhat unstable", score: 2 },
      { label: "Stable enough", score: 3 },
      { label: "Stable", score: 4 },
      { label: "Very stable", score: 5 },
    ],
  },
];

export default function RiskProfileScreen() {
  const [answers, setAnswers] = useState({});
  const [riskProfile, setRiskProfile] = useState(null);
  const [storageMode, setStorageMode] = useState("Local");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadSavedProfile = async () => {
    setLoading(true);
    setMessage("");

    try {
      const token = await getAuthToken();

      if (token) {
        const cloudProfile = await getCloudRiskProfile(token);

        if (cloudProfile) {
          setRiskProfile({
            profile: cloudProfile.profile || cloudProfile.profile_type,
            score: cloudProfile.score,
            description: cloudProfile.description,
            updated_at: cloudProfile.updated_at || "Cloud saved",
          });

          setAnswers(cloudProfile.answers || {});
        } else {
          setRiskProfile(null);
          setAnswers({});
        }

        setStorageMode("Cloud");
        return;
      }

      const savedAnswers = await getRiskAnswers();
      const savedProfile = await getRiskProfile();

      setAnswers(savedAnswers);
      setRiskProfile(savedProfile);
      setStorageMode("Local");
    } catch (error) {
      console.log("Cloud risk profile load error:", error);

      const savedAnswers = await getRiskAnswers();
      const savedProfile = await getRiskProfile();

      setAnswers(savedAnswers);
      setRiskProfile(savedProfile);
      setStorageMode("Local");
      setMessage("Unable to load cloud risk profile. Showing local profile.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedProfile();
    }, [])
  );

  const handleSelectAnswer = async (questionId, option) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: option,
    };

    setAnswers(updatedAnswers);
    setMessage("");

    if (storageMode === "Local") {
      await saveRiskAnswers(updatedAnswers);
    }
  };

  const calculateProfile = async () => {
    if (Object.keys(answers).length !== riskQuestions.length) {
      setMessage("Please answer all questions before calculating your profile.");
      return;
    }

    const totalScore = Object.values(answers).reduce(
      (total, answer) => total + Number(answer.score || 0),
      0
    );

    let profileType = "Conservative";
    let description =
      "You prefer stability and capital protection. Lower-risk assets may be more suitable for your comfort level.";

    if (totalScore >= 17 && totalScore <= 26) {
      profileType = "Moderate";
      description =
        "You can accept some investment risk for potential growth, but you still prefer a balanced approach.";
    }

    if (totalScore >= 27) {
      profileType = "Aggressive";
      description =
        "You are willing to accept higher risk and larger price movement for potential long-term growth.";
    }

    const profile = {
      profile: profileType,
      score: totalScore,
      description,
      answers,
      updated_at: new Date().toLocaleString(),
    };

    setRiskProfile(profile);

    try {
      const token = await getAuthToken();

      if (token) {
        const savedCloudProfile = await saveCloudRiskProfile(token, profile);

        setRiskProfile({
          profile: savedCloudProfile.profile || savedCloudProfile.profile_type,
          score: savedCloudProfile.score,
          description: savedCloudProfile.description || description,
          answers: savedCloudProfile.answers || answers,
          updated_at: savedCloudProfile.updated_at || profile.updated_at,
        });

        setStorageMode("Cloud");
        setMessage("Risk profile saved to cloud.");
        return;
      }

      await saveRiskProfile(profile);
      await saveRiskAnswers(answers);

      setStorageMode("Local");
      setMessage("Risk profile saved locally.");
    } catch (error) {
      console.log("Cloud risk profile save error:", error);

      await saveRiskProfile(profile);
      await saveRiskAnswers(answers);

      setStorageMode("Local");
      setMessage("Cloud save failed, so risk profile was saved locally.");
    }
  };

  const resetProfile = async () => {
    try {
      const token = await getAuthToken();

      if (token && storageMode === "Cloud") {
        await clearCloudRiskProfile(token);
        setAnswers({});
        setRiskProfile(null);
        setMessage("Cloud risk profile reset.");
        return;
      }

      await clearRiskProfile();
      setAnswers({});
      setRiskProfile(null);
      setMessage("Local risk profile reset.");
    } catch (error) {
      console.log("Risk profile reset error:", error);

      await clearRiskProfile();
      setAnswers({});
      setRiskProfile(null);
      setStorageMode("Local");
      setMessage("Cloud reset failed, local risk profile reset.");
    }
  };

  const getProfileStyle = (profile) => {
    if (profile === "Conservative") {
      return styles.conservativeBadge;
    }

    if (profile === "Moderate") {
      return styles.moderateBadge;
    }

    if (profile === "Aggressive") {
      return styles.aggressiveBadge;
    }

    return styles.neutralBadge;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.tag}>Risk Profile</Text>
          <Text style={styles.title}>Investor Risk Questionnaire</Text>
          <Text style={styles.description}>
            Answer simple questions to estimate your personal risk tolerance.
            Logged-in users use cloud storage, while guests use local storage.
          </Text>
        </View>

        <View style={styles.modeCard}>
          <Text style={styles.modeLabel}>Current Storage Mode</Text>
          <Text style={styles.modeValue}>{storageMode}</Text>
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Loading Risk Profile...</Text>
          </View>
        ) : null}

        {riskProfile ? (
          <View style={styles.resultCard}>
            <View style={[styles.profileBadge, getProfileStyle(riskProfile.profile)]}>
              <Text style={styles.profileBadgeText}>{riskProfile.profile}</Text>
            </View>

            <Text style={styles.resultTitle}>Your Risk Profile</Text>
            <Text style={styles.scoreText}>Score: {riskProfile.score} / 35</Text>
            <Text style={styles.resultDescription}>{riskProfile.description}</Text>
            <Text style={styles.updatedText}>Updated: {riskProfile.updated_at}</Text>
          </View>
        ) : null}

        {riskQuestions.map((item, index) => (
          <View key={item.id} style={styles.questionCard}>
            <Text style={styles.questionNumber}>Question {index + 1}</Text>
            <Text style={styles.questionText}>{item.question}</Text>

            <View style={styles.optionList}>
              {item.options.map((option) => {
                const isSelected = answers[item.id]?.score === option.score;

                return (
                  <Pressable
                    key={option.score}
                    style={[
                      styles.optionButton,
                      isSelected && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleSelectAnswer(item.id, option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>

                    <Text
                      style={[
                        styles.optionScore,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option.score}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        {message ? (
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        <Pressable style={styles.calculateButton} onPress={calculateProfile}>
          <Text style={styles.calculateButtonText}>Calculate Risk Profile</Text>
        </Pressable>

        <Pressable style={styles.resetButton} onPress={resetProfile}>
          <Text style={styles.resetButtonText}>Reset Profile</Text>
        </Pressable>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Educational Use Only</Text>
          <Text style={styles.noteText}>
            This questionnaire is simplified for learning purposes and does not
            replace professional financial advice.
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

  modeCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },

  modeLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },

  modeValue: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "900",
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

  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },

  profileBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  conservativeBadge: {
    backgroundColor: colors.success,
  },

  moderateBadge: {
    backgroundColor: colors.warning,
  },

  aggressiveBadge: {
    backgroundColor: colors.danger,
  },

  neutralBadge: {
    backgroundColor: colors.secondary,
  },

  profileBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
  },

  resultTitle: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 6,
  },

  scoreText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8,
  },

  resultDescription: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 8,
  },

  updatedText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },

  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },

  questionNumber: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  questionText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 25,
    marginBottom: 14,
  },

  optionList: {
    gap: 10,
  },

  optionButton: {
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  optionText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
    lineHeight: 20,
  },

  optionTextSelected: {
    color: "#ffffff",
  },

  optionScore: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
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

  calculateButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 12,
  },

  calculateButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },

  resetButton: {
    backgroundColor: "#fef2f2",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#fecaca",
  },

  resetButtonText: {
    color: colors.danger,
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