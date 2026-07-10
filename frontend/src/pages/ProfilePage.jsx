import RiskProfileSection from "../components/RiskProfileSection";

function ProfilePage({
  riskQuestions,
  riskAnswers,
  setRiskAnswers,
  calculateRiskProfile,
  userRiskProfile,
}) {
  return (
    <>
      <section className="page-header">
        <h1>User Risk Profile</h1>
        <p>
          Complete the questionnaire to understand whether your investment risk
          profile is Conservative, Moderate, or Aggressive.
        </p>
      </section>

      <RiskProfileSection
        riskQuestions={riskQuestions}
        riskAnswers={riskAnswers}
        setRiskAnswers={setRiskAnswers}
        calculateRiskProfile={calculateRiskProfile}
        userRiskProfile={userRiskProfile}
      />
    </>
  );
}

export default ProfilePage;