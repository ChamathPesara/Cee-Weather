import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) => `navbar__link${isActive ? " navbar__link--active" : ""}`;

  return (
    <header className="navbar">
      <NavLink to="/home" className="navbar__brand">Cee Weather</NavLink>
      <nav className="navbar__links">
        <NavLink to="/home" className={linkClass} end>Home</NavLink>
        <NavLink to="/search" className={linkClass}>Search</NavLink>
        <NavLink to="/map" className={linkClass}>Map</NavLink>
        <NavLink to="/history" className={linkClass}>History</NavLink>
      </nav>
      <div className="navbar__right">
        {user && <span className="navbar__user">{user.name}</span>}
        <button className="navbar__logout" onClick={handleLogout}>Log out</button>
      </div>
    </header>
  );
};

export default Navbar;