import { Link, useNavigate } from "react-router";
import { useState } from "react";

function RegisterPage({ apiBaseUrl, setCurrentUser, setAuthToken }) {
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

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
      !registerForm.password.trim()
    ) {
      setRegisterError("Please complete all required fields.");
      return;
    }

    if (registerForm.password.length < 6) {
      setRegisterError("Password must be at least 6 characters long.");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError("Passwords do not match.");
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

      navigate("/");
    } catch (error) {
      setRegisterError(error.message);
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
            Register an account to prepare for future cloud-based watchlist,
            risk profile, and analysis history storage.
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
              <input
                type="password"
                name="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={registerForm.confirmPassword}
                onChange={handleRegisterChange}
                placeholder="Re-enter your password"
              />
            </div>

            <button type="submit" disabled={registerLoading}>
              {registerLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-switch-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>

          <div className="guest-note">
            <strong>Current Note:</strong>
            <p>
              In this version, account login is available, but watchlist and
              history are still stored locally. Cloud saving will be added in the
              next phase.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default RegisterPage;