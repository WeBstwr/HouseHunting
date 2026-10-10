import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { mockAccounts } from '../../../data/mockAccounts'
import useAuthStore from '../../../store/authStore'
import './login.css'

const protectedPaths = ['/add-property', '/my-listings']

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const loginWithEmail = useAuthStore((state) => state.loginWithEmail)
  const logout = useAuthStore((state) => state.logout)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const destinationForRole = (role) => ['landlord', 'agent'].includes(role) ? '/my-listings' : '/'

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = loginWithEmail(email)

    if (!result.ok) {
      setMessage(result.message)
      return
    }

    const requestedPath = location.state?.from?.pathname
    const canReturnToRequestedPath = requestedPath && (
      !protectedPaths.includes(requestedPath)
      || (requestedPath === '/add-property' && result.user.role === 'landlord')
      || (requestedPath === '/my-listings' && ['landlord', 'agent'].includes(result.user.role))
    )

    navigate(canReturnToRequestedPath ? requestedPath : destinationForRole(result.user.role), { replace: true })
  }

  return (
    <main className="mock-login">
      <section className="container mock-login__card" aria-labelledby="mock-login-title">
        <p className="mock-login__eyebrow">Frontend demo access</p>
        <h1 id="mock-login-title">Sign in with a demo email</h1>
        <p>Enter one of the available demo emails. This frontend-only flow does not collect a password.</p>

        {user && <p className="mock-login__current">Current session: <strong>{user.name}</strong> ({user.role})</p>}

        <form className="mock-login__form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="demo-email">Email address</label>
          <input
            autoComplete="email"
            id="demo-email"
            list="demo-account-emails"
            onChange={(event) => { setEmail(event.target.value); setMessage('') }}
            placeholder="name@househunting.test"
            type="email"
            value={email}
          />
          <datalist id="demo-account-emails">
            {mockAccounts.map((account) => <option key={account.id} value={account.email}>{account.role}</option>)}
          </datalist>
          {message && <p className="mock-login__message" role="alert">{message}</p>}
          <button type="submit">Continue</button>
        </form>

        <div className="mock-login__accounts" aria-label="Available demo accounts">
          <p>Available demo accounts</p>
          <ul>{mockAccounts.map((account) => <li key={account.id}><code>{account.email}</code><span>{account.role}</span></li>)}</ul>
        </div>

        {user && <button className="mock-login__logout" type="button" onClick={logout}>Log out</button>}
        <p className="mock-login__register">Need a tenant or landlord account? <Link to="/register">Register a mock account</Link>.</p>
        <Link className="mock-login__browse" to="/">Continue browsing anonymously</Link>
      </section>
    </main>
  )
}

export default Login
