function SuitabilitySection({ userRiskProfile, stockRiskLevel, suitabilityResult }) {
  if (!userRiskProfile || !suitabilityResult) {
    return null;
  }

  return (
    <section className="suitability-section">
      <h3>Suitability Analysis</h3>

      <div className="suitability-grid">
        <div>
          <span className="label">User Risk Profile</span>
          <p>{userRiskProfile.profile}</p>
        </div>

        <div>
          <span className="label">Stock Risk Level</span>
          <p>{stockRiskLevel}</p>
        </div>

        <div>
          <span className="label">Suitability Result</span>
          <p>{suitabilityResult.suitability}</p>
        </div>
      </div>

      <p className="suitability-text">{suitabilityResult.explanation}</p>
    </section>
  );
}

export default SuitabilitySection;