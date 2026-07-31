import { Link, useNavigate } from "react-router";
import { useState } from "react";

function RegisterPage({
  apiBaseUrl,
  setCurrentUser,
  setAuthToken,
  resetAnalysisState,
  resetComparisonState,
  showToast,
}) {
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;

    setRegisterForm({
      ...registerForm,
      [name]: value,
    });
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    if (
      !registerForm.fullName.trim() ||
      !registerForm.email.trim() ||
      !registerForm.password.trim() ||
      !registerForm.confirmPassword.trim()
    ) {
      setRegisterError("Please complete all required fields.");
      showToast("Please complete all required fields.", "error");
      return;
    }

    if (registerForm.password.length < 6) {
      setRegisterError("Password must be at least 6 characters long.");
      showToast("Password must be at least 6 characters long.", "error");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError("Passwords do not match.");
      showToast("Passwords do not match.", "error");
      return;
    }

    setRegisterLoading(true);
    setRegisterError("");

    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: registerForm.fullName.trim(),
          email: registerForm.email.trim(),
          password: registerForm.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to register account.");
      }

      localStorage.setItem("finsightAuthToken", data.access_token);
      localStorage.setItem("finsightCurrentUser", JSON.stringify(data.user));

      setAuthToken(data.access_token);
      setCurrentUser(data.user);

      resetAnalysisState();
      resetComparisonState();

      showToast("Account created successfully.", "success");
      navigate("/");
    } catch (error) {
      setRegisterError(error.message);
      showToast("Registration failed. Please try again.", "error");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <>
      <section className="auth-hero">
        <div>
          <span className="page-tag">Create Account</span>
          <h1>Create Your FinSight Account</h1>
          <p>
            Register an account to save your watchlist, risk profile, and
            analysis history in the cloud.
          </p>
        </div>
      </section>

      <section className="auth-section">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Register</h2>
            <p>Create a new FinSight account.</p>
          </div>

          {registerError && <div className="auth-error">{registerError}</div>}

          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div>
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={registerForm.fullName}
                onChange={handleRegisterChange}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label>Password</label>

              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  placeholder="Minimum 6 characters"
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

            <div>
              <label>Confirm Password</label>

              <div className="password-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="Re-enter your password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={registerLoading}>
              {registerLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-switch-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>

          <div className="guest-note">
            <strong>Guest Mode:</strong>
            <p>
              You can still use FinSight without creating an account. Guest data
              is saved only in this browser. Create an account to save your data
              to the database.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default RegisterPage;