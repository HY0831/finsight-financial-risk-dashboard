import { Link } from "react-router";

function AccountPage({
  currentUser,
  watchlist,
  searchHistory,
  userRiskProfile,
  handleLogout,
}) {
  const isLoggedIn = Boolean(currentUser);

  return (
    <>
      <section className="account-hero">
        <div>
          <span className="page-tag">Account</span>
          <h1>Your FinSight Account</h1>
          <p>
            View your current login status and understand how FinSight stores
            your watchlist, risk profile, and analysis history.
          </p>
        </div>
      </section>

      <section className="account-section">
        <div className="account-status-card">
          <span className={isLoggedIn ? "account-status logged-in" : "account-status guest"}>
            {isLoggedIn ? "Logged In" : "Guest Mode"}
          </span>

          <h2>
            {isLoggedIn
              ? `Hi, ${currentUser.full_name}`
              : "You are currently using FinSight as a guest"}
          </h2>

          <p>
            {isLoggedIn
              ? "Your watchlist, risk profile, and analysis history are saved to your account database."
              : "Your watchlist, risk profile, and analysis history are saved only in this browser using localStorage."}
          </p>

          {isLoggedIn ? (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <div className="account-actions">
              <Link to="/login">Login</Link>
              <Link to="/register" className="primary-account-link">
                Create Account
              </Link>
            </div>
          )}
        </div>

        <div className="account-summary-grid">
          <div className="account-summary-card">
            <span>Saved Stocks</span>
            <strong>{watchlist.length}</strong>
            <p>
              {isLoggedIn
                ? "Stocks saved in your account watchlist."
                : "Stocks saved in guest browser storage."}
            </p>
          </div>

          <div className="account-summary-card">
            <span>Risk Profile</span>
            <strong>{userRiskProfile ? userRiskProfile.profile : "Not Set"}</strong>
            <p>
              {userRiskProfile
                ? `Current score: ${userRiskProfile.score}`
                : "Complete the questionnaire to generate your profile."}
            </p>
          </div>

          <div className="account-summary-card">
            <span>Analysis History</span>
            <strong>{searchHistory.length}</strong>
            <p>
              {isLoggedIn
                ? "History records saved under your account."
                : "History records saved locally in this browser."}
            </p>
          </div>
        </div>
      </section>

      <section className="account-storage-section">
        <div className="section-heading">
          <h2>Storage Mode Explanation</h2>
          <p>
            FinSight supports both guest mode and logged-in mode so users can
            try the system freely before creating an account.
          </p>
        </div>

        <div className="account-storage-grid">
          <div className="account-storage-card">
            <h3>Guest Mode</h3>
            <p>
              Data is stored in the browser only. If the browser data is cleared
              or another device is used, the saved data may not appear.
            </p>
          </div>

          <div className="account-storage-card">
            <h3>Logged-in Mode</h3>
            <p>
              Data is saved to the backend database and linked to the user
              account. This supports more persistent and personalised usage.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default AccountPage;