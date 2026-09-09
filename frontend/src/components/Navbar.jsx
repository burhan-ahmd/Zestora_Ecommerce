import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = ({ onToggleSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, userRole, clearAuthData } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname.startsWith("/dashboard");

  const handleLogout = () => {
    clearAuthData();
    setMenuOpen(false);
    navigate("/login");
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`navbar ${isDashboard ? "navbar-dashboard" : ""}`}>
      <div className="container navbar-container">
        <div className="navbar-left">
          {isDashboard && (
            <button
              className="navbar-hamburger"
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          )}
          <Link
            to={"/"}
            className="logo"
            onClick={handleNavClick}
          >
            Zestora
          </Link>
        </div>

        <div className={`navbar-dropdown ${menuOpen ? "navbar-dropdown-open" : ""}`}>
          {!isDashboard && (
            <nav className="nav-links">
              <Link to="/" className="nav-link" onClick={handleNavClick}>
                Home
              </Link>
              <Link to="/products" className="nav-link" onClick={handleNavClick}>
                Products
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="nav-link" onClick={handleNavClick}>
                  Dashboard
                </Link>
              )}
            </nav>
          )}

          {isDashboard && (
            <nav className="nav-links">
              <Link to="/dashboard" className="nav-link" onClick={handleNavClick}>
                Dashboard
              </Link>
              {userRole === "admin" && (
                <>
                  <Link to="/dashboard/categories" className="nav-link" onClick={handleNavClick}>
                    Categories
                  </Link>
                  <Link to="/dashboard/products" className="nav-link" onClick={handleNavClick}>
                    Products
                  </Link>
                </>
              )}

              <Link to="/dashboard/orders" className="nav-link" onClick={handleNavClick}>
                {userRole === "admin" ? "Orders" : "My Orders"}
              </Link>

              <Link to="/" className="nav-link" onClick={handleNavClick}>
                Back to Shop
              </Link>
              
            </nav>
          )}

          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <span className="nav-user-name">
                  {user?.name || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="logout-button"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="login-link" onClick={handleNavClick}>
                Login
              </Link>
            )}

            {!isDashboard && (
              <Link to="/cart" className="cart-button" onClick={handleNavClick}>
                <span className="cart-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />
                    <circle cx="10" cy="20" r="1" />
                    <circle cx="18" cy="20" r="1" />
                  </svg>
                </span>
                <span>Cart</span>
                <span className="cart-count">{totalItems}</span>
              </Link>
            )}
          </div>
        </div>

        <button
          className={`navbar-burger ${menuOpen ? "navbar-burger-open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
