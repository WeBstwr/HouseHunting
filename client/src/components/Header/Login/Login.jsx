import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { mockAccounts } from '../../../data/mockAccounts'
import useAuthStore from '../../../store/authStore'
import './login.css'

const canReturnToPath = (pathname, role) => {
  if (!pathname) return false
  if (pathname === '/add-property' || pathname === '/landlord-dashboard') return role === 'landlord'
  if (pathname === '/agent-dashboard') return role === 'agent'
  if (pathname === '/my-listings') return ['landlord', 'agent'].includes(role)
  if (pathname.startsWith('/edit-property/')) return ['landlord', 'agent'].includes(role)
  return true
}

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const loginWithEmail = useAuthStore((state) => state.loginWithEmail)
  const logout = useAuthStore((state) => state.logout)
  const [email, setEmail] = useState(location.state?.email || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState(location.state?.message || '')

  const destinationForRole = (role) => ['landlord', 'agent'].includes(role) ? '/my-listings' : '/'

  const handleSubmit = (event) => {
    event.preventDefault()
    const cleanEmail = email.trim()

    if (!cleanEmail || !password) {
      setMessage('Enter your email address and password.')
      return
    }

    const result = loginWithEmail(cleanEmail, password)
    if (!result.ok) {
      setMessage(result.message)
      return
    }

    const requestedPath = location.state?.from?.pathname
    const canReturnToRequestedPath = canReturnToPath(requestedPath, result.user.role)
    navigate(canReturnToRequestedPath ? requestedPath : destinationForRole(result.user.role), { replace: true })
  }

  return (
    <main className="mock-login">
      <section className="container mock-login__card" aria-labelledby="login-title">
        <p className="mock-login__eyebrow">Welcome back</p>
        <h1 id="login-title">Sign in to HouseHunting</h1>
        <p>Access your account to continue managing or exploring properties.</p>

        {user && <p className="mock-login__current">Signed in as <strong>{user.name}</strong> ({user.role})</p>}

        <form className="mock-login__form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="login-email">Email address</label>
          <input
            autoComplete="email"
            id="login-email"
            list="account-emails"
            onChange={(event) => { setEmail(event.target.value); setMessage('') }}
            placeholder="you@example.com"
            type="email"
            value={email}
          />
          <datalist id="account-emails">
            {mockAccounts.map((account) => <option key={account.id} value={account.email}>{account.role}</option>)}
          </datalist>
          <label htmlFor="login-password">Password</label>
          <div className="mock-login__password-field">
            <input autoComplete="current-password" id="login-password" onChange={(event) => { setPassword(event.target.value); setMessage('') }} type={showPassword ? 'text' : 'password'} value={password} />
            <button aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} type="button">{showPassword ? 'Hide' : 'Show'}</button>
          </div>
          {message && <p className="mock-login__message" role="alert">{message}</p>}
          <button type="submit">Sign in</button>
        </form>

        {user && <button className="mock-login__logout" type="button" onClick={logout}>Log out</button>}
        <p className="mock-login__register">New to HouseHunting? <Link state={{ from: location.state?.from }} to="/register">Create an account</Link>.</p>
        <Link className="mock-login__browse" to="/">Continue browsing properties</Link>
      </section>
    </main>
  )
}

export default Login
