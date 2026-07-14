function RiskProfileSection({
  riskQuestions,
  riskAnswers,
  setRiskAnswers,
  calculateRiskProfile,
  userRiskProfile,
  resetRiskProfile,
}) {
  return (
    <section className="risk-profile-section">
      <div className="section-title">
        <h2>User Risk Profile Questionnaire</h2>
        <p>
          Answer these questions to identify your investment risk tolerance.
          This simplified questionnaire considers common risk profiling factors
          such as investment objective, time horizon, investment experience,
          financial situation, and comfort with market volatility.
        </p>

        <p className="source-note">
          Questionnaire adapted for educational purposes based on common
          investor risk profiling factors discussed by FINRA, Vanguard, CIRO,
          and Ameriprise.
        </p>
      </div>

      <div className="question-list">
        {riskQuestions.map((item, index) => (
          <div className="question-card" key={item.id}>
            <h3>
              {index + 1}. {item.question}
            </h3>

            <div className="option-group">
              {item.options.map((option) => (
                <label className="option-item" key={option.text}>
                  <input
                    type="radio"
                    name={item.id}
                    value={option.score}
                    checked={riskAnswers[item.id] === option.score}
                    onChange={() =>
                      setRiskAnswers({
                        ...riskAnswers,
                        [item.id]: option.score,
                      })
                    }
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="profile-button" onClick={calculateRiskProfile}>
        Calculate My Risk Profile
      </button>

      {userRiskProfile && (
        <div className="profile-result">
          <h3>Your Risk Profile: {userRiskProfile.profile}</h3>
          <p>Total Score: {userRiskProfile.score} / 35</p>
          <p>{userRiskProfile.description}</p>

          <button
            type="button"
            className="reset-profile-button"
            onClick={resetRiskProfile}
          >
            Reset Risk Profile
          </button>
        </div>
      )}
    </section>
  );
}

export default RiskProfileSection;