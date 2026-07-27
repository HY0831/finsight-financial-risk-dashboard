import { NavLink } from "react-router";

function Navbar({ theme, setTheme, currentUser, handleLogout }) {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        FinSight
      </NavLink>

      <div className="navbar-links">
        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to="/analyze">Analyze</NavLink>
        <NavLink to="/compare">Compare</NavLink>
        <NavLink to="/watchlist">Watchlist</NavLink>
        <NavLink to="/profile">Risk Profile</NavLink>
        <NavLink to="/history">History</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>

      <div className="navbar-right">
        <div className="theme-selector">
          <span>
            {theme === "dark"
              ? "Dark"
              : theme === "eye"
              ? "Eye Protection"
              : "Light"}
          </span>

          <select
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
            aria-label="Select website theme"
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
            <option value="eye">Eye Protection</option>
          </select>
        </div>

        <div className="auth-navbar">
          {currentUser ? (
            <>
              <span className="auth-user-name">
                Hi, {currentUser.full_name}
              </span>

              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="register-link">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;