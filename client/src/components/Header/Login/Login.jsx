import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../../../store/authStore'
import './login.css'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const loginAsTenant = useAuthStore((state) => state.loginAsTenant)
  const loginAsLandlord = useAuthStore((state) => state.loginAsLandlord)
  const loginAsLandlordB = useAuthStore((state) => state.loginAsLandlordB)
  const logout = useAuthStore((state) => state.logout)
  const destination = location.state?.from?.pathname || '/'

  const selectMockUser = (login) => {
    login()
    navigate(destination, { replace: true })
  }

  return (
    <main className="mock-login">
      <section className="container mock-login__card" aria-labelledby="mock-login-title">
        <p className="mock-login__eyebrow">Development authentication</p>
        <h1 id="mock-login-title">Choose a mock role</h1>
        <p>This temporary selector is for frontend development only. It does not create or verify a real account.</p>

        {user && <p className="mock-login__current">Current session: <strong>{user.name}</strong> ({user.role})</p>}

        <div className="mock-login__actions">
          <button type="button" onClick={() => selectMockUser(loginAsTenant)}>Continue as tenant</button>
          <button type="button" onClick={() => selectMockUser(loginAsLandlord)}>Continue as landlord</button>
          <button type="button" onClick={() => selectMockUser(loginAsLandlordB)}>Continue as landlord B</button>
        </div>

        {user && <button className="mock-login__logout" type="button" onClick={logout}>Log out</button>}
        <Link to="/">Continue browsing anonymously</Link>
      </section>
    </main>
  )
}

export default Login
