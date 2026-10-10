import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import './header.css'

const publicNavigation = [
  { label: 'Home', to: '/', end: true },
  { label: 'Find a House', to: '/listings' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    const handleEscape = (event) => { if (event.key === 'Escape') closeMenu() }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  const renderPublicLinks = (mobile = false) => publicNavigation.map(({ label, to, end }) => (
    <NavLink
      className={({ isActive }) => `header__nav-link${isActive ? ' header__nav-link--active' : ''}`}
      end={end}
      key={to}
      onClick={mobile ? closeMenu : undefined}
      to={to}
    >
      {label}
    </NavLink>
  ))

  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/')
  }

  const renderAccountActions = (mobile = false) => {
    const closeOnMobile = mobile ? closeMenu : undefined

    if (!user) {
      return (
        <>
          <Link className="header__auth-link" onClick={closeOnMobile} to="/login">Login</Link>
          <Link className="header__register-link" onClick={closeOnMobile} to="/register">Register</Link>
          <Link className="header__cta" onClick={closeOnMobile} state={{ from: { pathname: '/add-property' } }} to="/login">List Your Property</Link>
        </>
      )
    }

    if (user.role === 'landlord') {
      return (
        <>
          <NavLink className="header__auth-link" onClick={closeOnMobile} to="/my-listings">My Listings</NavLink>
          <Link className="header__cta" onClick={closeOnMobile} to="/add-property">Add Property</Link>
          <button className="header__logout" onClick={handleLogout} type="button">Log out</button>
        </>
      )
    }

    if (user.role === 'agent') {
      return (
        <>
          <NavLink className="header__auth-link" onClick={closeOnMobile} to="/my-listings">Managed Listings</NavLink>
          <button className="header__logout" onClick={handleLogout} type="button">Log out</button>
        </>
      )
    }

    return (
      <>
        <span className="header__session-label">Tenant account</span>
        <button className="header__logout" onClick={handleLogout} type="button">Log out</button>
      </>
    )
  }

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Link aria-label="HouseHunting home" className="site-header__brand" to="/">House<span>Hunting</span></Link>
        <nav aria-label="Primary navigation" className="site-header__desktop-nav">{renderPublicLinks()}</nav>
        <div className="site-header__actions">{renderAccountActions()}</div>
        <button aria-controls="mobile-navigation" aria-expanded={isMenuOpen} aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} className={`site-header__menu-button${isMenuOpen ? ' site-header__menu-button--open' : ''}`} onClick={() => setIsMenuOpen((isOpen) => !isOpen)} type="button"><span /><span /><span /></button>
      </div>
      <nav aria-label="Mobile navigation" className={`site-header__mobile-nav${isMenuOpen ? ' site-header__mobile-nav--open' : ''}`} id="mobile-navigation">
        <div className="site-header__mobile-content container">
          <div className="site-header__mobile-links">{renderPublicLinks(true)}</div>
          <div className="site-header__mobile-actions">{renderAccountActions(true)}</div>
        </div>
      </nav>
    </header>
  )
}

export default Header
