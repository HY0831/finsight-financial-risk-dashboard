import { NavLink } from "react-router";

function Navbar() {
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
    </nav>
  );
}

export default Navbar;