import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./header.css";

const publicNavigation = [
  { label: "Home", to: "/", end: true },
  { label: "Find a House", to: "/listings" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const renderPublicLinks = (mobile = false) =>
    publicNavigation.map(({ label, to, end }) => (
      <NavLink
        className={({ isActive }) =>
          `header__nav-link${isActive ? " header__nav-link--active" : ""}`
        }
        end={end}
        key={to}
        onClick={mobile ? closeMenu : undefined}
        to={to}
      >
        {label}
      </NavLink>
    ));

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Link aria-label="HouseHunting home" className="site-header__brand" to="/">
          House<span>Hunting</span>
        </Link>

        <nav aria-label="Primary navigation" className="site-header__desktop-nav">
          {renderPublicLinks()}
        </nav>

        <div className="site-header__actions">
          <Link className="header__auth-link" to="/login">
            Login
          </Link>
          <Link className="header__register-link" to="/register">
            Register
          </Link>
          <Link className="header__cta" to="/add-property">
            List Your Property
          </Link>
        </div>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className={`site-header__menu-button${isMenuOpen ? " site-header__menu-button--open" : ""}`}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav
        aria-label="Mobile navigation"
        className={`site-header__mobile-nav${isMenuOpen ? " site-header__mobile-nav--open" : ""}`}
        id="mobile-navigation"
      >
        <div className="site-header__mobile-content container">
          <div className="site-header__mobile-links">{renderPublicLinks(true)}</div>
          <div className="site-header__mobile-actions">
            <Link className="header__auth-link" onClick={closeMenu} to="/login">
              Login
            </Link>
            <Link className="header__register-link" onClick={closeMenu} to="/register">
              Register
            </Link>
            <Link className="header__cta" onClick={closeMenu} to="/add-property">
              List Your Property
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
