import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">Studio<span>.</span>Arch</Link>
        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/admin" className="nav-cta">Admin</NavLink>
              <button className="btn small" onClick={logout}>Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
