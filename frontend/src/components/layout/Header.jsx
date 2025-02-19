import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import './Header.css';  // Import the header-specific styles

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <i className="fas fa-utensils logo-icon"></i>
          <span className="logo-text">RecipeAI</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/features" className="nav-link">Features</NavLink>
          <NavLink to="/recipes" className="nav-link">Recipes</NavLink>
          <NavLink to="/about" className="nav-link">About</NavLink>
        </nav>

        <div className="auth-buttons">
          {user ? (
            <button
              onClick={() => dispatch(logout())}
              className="btn-text"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-text">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="mobile-menu-btn">
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </header>
  );
} 