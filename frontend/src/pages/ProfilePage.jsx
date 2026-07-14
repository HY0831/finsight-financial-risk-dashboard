import RiskProfileSection from "../components/RiskProfileSection";

function ProfilePage({
  riskQuestions,
  riskAnswers,
  setRiskAnswers,
  calculateRiskProfile,
  userRiskProfile,
  resetRiskProfile,
}) {
  return (
    <>
      <section className="profile-hero">
        <div>
          <span className="page-tag">Investor Risk Profile</span>
          <h1>Understand Your Investment Risk Tolerance</h1>
          <p>
            Complete a short questionnaire to estimate whether your investment
            profile is Conservative, Moderate, or Aggressive. This result will
            also improve the suitability insight in your PDF report.
          </p>
        </div>
      </section>

      <section className="profile-info-grid">
        <div className="profile-info-card">
          <span>01</span>
          <h3>Answer 7 Questions</h3>
          <p>
            The questionnaire considers your objective, time horizon, reaction to
            losses, knowledge, and financial stability.
          </p>
        </div>

        <div className="profile-info-card">
          <span>02</span>
          <h3>Get Profile Result</h3>
          <p>
            FinSight calculates a score and classifies your profile as
            Conservative, Moderate, or Aggressive.
          </p>
        </div>

        <div className="profile-info-card">
          <span>03</span>
          <h3>Improve Suitability Insight</h3>
          <p>
            Your profile is compared with the stock risk level to provide a more
            personalised suitability explanation.
          </p>
        </div>
      </section>

      <section className="profile-explanation-section">
        <div className="section-heading">
          <h2>What Each Profile Means</h2>
          <p>
            The profile result helps users understand how much stock price
            movement they may be comfortable with.
          </p>
        </div>

        <div className="profile-type-grid">
          <div className="profile-type-card conservative">
            <h3>Conservative</h3>
            <p>
              Prefers stability and capital protection. Usually more suitable
              for lower volatility stocks.
            </p>
          </div>

          <div className="profile-type-card moderate">
            <h3>Moderate</h3>
            <p>
              Willing to accept some risk for potential growth. Usually suitable
              for balanced risk levels.
            </p>
          </div>

          <div className="profile-type-card aggressive">
            <h3>Aggressive</h3>
            <p>
              Comfortable with higher volatility for potential long-term growth.
              May accept higher risk stocks.
            </p>
          </div>
        </div>
      </section>

      <RiskProfileSection
        riskQuestions={riskQuestions}
        riskAnswers={riskAnswers}
        setRiskAnswers={setRiskAnswers}
        calculateRiskProfile={calculateRiskProfile}
        userRiskProfile={userRiskProfile}
        resetRiskProfile={resetRiskProfile}
      />
    </>
  );
}

export default ProfilePage;