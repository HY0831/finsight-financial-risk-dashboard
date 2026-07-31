import { Link } from "react-router";
import { useEffect, useState } from "react";

function AccountPage({
  currentUser,
  watchlist,
  searchHistory,
  userRiskProfile,
  handleLogout,
  storageModeText,
  isCloudSaveOn,
  apiBaseUrl,
}) {
  const [apiStatus, setApiStatus] = useState("Checking...");

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/health`);

        if (!response.ok) {
          throw new Error("API unavailable");
        }

        const data = await response.json();

        if (data.status === "ok") {
          setApiStatus("Connected");
        } else {
          setApiStatus("Unavailable");
        }
      } catch {
        setApiStatus("Unavailable");
      }
    };

    checkApiStatus();
  }, [apiBaseUrl]);

  return (
    <>
      <section className="account-hero">
        <div>
          <span className="page-tag">Account</span>
          <h1>Your FinSight Account</h1>
          <p>
            View your login status, storage mode, and saved FinSight activity.
          </p>
        </div>
      </section>

      <section className="account-section">
        <div className="account-status-card">
          <span
            className={`account-status ${
              isCloudSaveOn ? "logged-in" : "guest"
            }`}
          >
            {isCloudSaveOn ? "Cloud Save On" : "Guest Mode"}
          </span>

          <h2>
            {currentUser
              ? `Hi, ${currentUser.full_name}`
              : "You are using FinSight as a guest"}
          </h2>

          <p>{storageModeText}</p>

          {currentUser ? (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <div className="account-actions">
              <Link to="/login" className="primary-account-link">
                Login
              </Link>

              <Link to="/register">Create Account</Link>
            </div>
          )}
        </div>

        <div className="account-summary-grid">
          <div className="account-summary-card">
            <span>Watchlist Items</span>
            <strong>{watchlist.length}</strong>
            <p>Stocks currently saved in your watchlist.</p>
          </div>

          <div className="account-summary-card">
            <span>Risk Profile</span>
            <strong>
              {userRiskProfile ? userRiskProfile.profile : "Not Set"}
            </strong>
            <p>
              {userRiskProfile
                ? `Current score: ${userRiskProfile.score}`
                : "Complete the questionnaire to generate your profile."}
            </p>
          </div>

          <div className="account-summary-card">
            <span>Analysis History</span>
            <strong>{searchHistory.length}</strong>
            <p>Stocks saved in your recent analysis history.</p>
          </div>
        </div>
      </section>

      <section className="account-storage-section">
        <div className="section-heading">
          <h2>System Status</h2>
          <p>
            FinSight uses a FastAPI backend and database storage for logged-in
            users.
          </p>
        </div>

        <div className="account-storage-grid">
          <div className="account-storage-card">
            <h3>API Status</h3>
            <p>
              Current backend connection: <strong>{apiStatus}</strong>
            </p>
          </div>

          <div className="account-storage-card">
            <h3>Storage Mode</h3>
            <p>{storageModeText}</p>
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
              Data is stored in this browser only. If browser data is cleared or
              another device is used, the saved data may not appear.
            </p>
          </div>

          <div className="account-storage-card">
            <h3>Cloud Save Mode</h3>
            <p>
              Data is saved to the backend database and linked to the user
              account. This provides more persistent and personalised usage.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default AccountPage;