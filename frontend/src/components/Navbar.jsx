import { NavLink } from "react-router";

function Navbar({ theme, setTheme, currentUser, handleLogout }) {
  return (
    <header className="nav-wrapper">
      <div className="nav-topbar">
        <div className="theme-selector topbar-theme-selector">
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

        <div className="auth-topbar">
          {currentUser ? (
            <>
              <span>Hi, {currentUser.full_name}</span>
              <span className="cloud-save-text">Cloud Save On</span>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="topbar-register">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>

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
          <NavLink to="/account">Account</NavLink>
          <NavLink to="/about">About</NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;