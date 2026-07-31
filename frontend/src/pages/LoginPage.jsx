import { Link, useNavigate } from "react-router";
import { useState } from "react";

function LoginPage({
  apiBaseUrl,
  setCurrentUser,
  setAuthToken,
  resetAnalysisState,
  resetComparisonState,
  showToast,
}) {
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;

    setLoginForm({
      ...loginForm,
      [name]: value,
    });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      setLoginError("Please enter your email and password.");
      showToast("Please enter your email and password.", "error");
      return;
    }

    setLoginLoading(true);
    setLoginError("");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginForm.email.trim(),
          password: loginForm.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to login.");
      }

      localStorage.setItem("finsightAuthToken", data.access_token);
      localStorage.setItem("finsightCurrentUser", JSON.stringify(data.user));

      setAuthToken(data.access_token);
      setCurrentUser(data.user);

      resetAnalysisState();
      resetComparisonState();

      showToast("Login successful.", "success");
      navigate("/");
    } catch (error) {
      setLoginError(error.message);
      showToast("Login failed. Please check your email and password.", "error");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <>
      <section className="auth-hero">
        <div>
          <span className="page-tag">Account Login</span>
          <h1>Welcome Back to FinSight</h1>
          <p>
            Login to your FinSight account to save your watchlist, risk profile,
            and analysis history in the cloud.
          </p>
        </div>
      </section>

      <section className="auth-section">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Login</h2>
            <p>Enter your email and password to continue.</p>
          </div>

          {loginError && <div className="auth-error">{loginError}</div>}

          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label>Password</label>

              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loginLoading}>
              {loginLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-switch-text">
            Do not have an account? <Link to="/register">Create account</Link>
          </p>

          <div className="guest-note">
            <strong>Guest Mode:</strong>
            <p>
              You can still use FinSight without logging in. Guest data is saved
              only in this browser. Login to save your data to the database.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginPage;