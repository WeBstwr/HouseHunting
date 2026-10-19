import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../../../store/authStore'
import './register.css'

const validEmail = (email) => /^\S+@\S+\.\S+$/.test(email)

const Register = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const registerMockUser = useAuthStore((state) => state.registerMockUser)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'tenant' })
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()

    if (form.name.trim().length < 2) return setMessage('Enter your full name.')
    if (!validEmail(email)) return setMessage('Enter a valid email address.')
    if (form.password.length < 8) return setMessage('Use a password with at least 8 characters.')
    if (form.password !== form.confirmPassword) return setMessage('Your passwords do not match.')

    const result = registerMockUser({ name: form.name, email, password: form.password, role: form.role })
    if (!result.ok) return setMessage(result.message)

    navigate('/login', {
      replace: true,
      state: {
        email: result.user.email,
        from: location.state?.from,
        message: 'Your account has been created. Sign in to continue.',
      },
    })
  }

  return (
    <main className="mock-register">
      <section className="container mock-register__card" aria-labelledby="register-title">
        <p className="mock-register__eyebrow">Find your next home</p>
        <h1 id="register-title">Create your account</h1>
        <p>Join HouseHunting to manage your property activity in one place.</p>
        <form className="mock-register__form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="register-name">Full name</label>
          <input autoComplete="name" id="register-name" name="name" onChange={updateField} value={form.name} />
          <label htmlFor="register-email">Email address</label>
          <input autoComplete="email" id="register-email" name="email" onChange={updateField} type="email" value={form.email} />
          <label htmlFor="register-password">Password</label>
          <div className="mock-register__password-field"><input autoComplete="new-password" id="register-password" name="password" onChange={updateField} type={showPassword ? 'text' : 'password'} value={form.password} /><button aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} type="button">{showPassword ? 'Hide' : 'Show'}</button></div>
          <label htmlFor="register-confirm-password">Confirm password</label>
          <input autoComplete="new-password" id="register-confirm-password" name="confirmPassword" onChange={updateField} type={showPassword ? 'text' : 'password'} value={form.confirmPassword} />
          <label htmlFor="register-role">Account type</label>
          <select id="register-role" name="role" onChange={updateField} value={form.role}>
            <option value="tenant">Tenant</option>
            <option value="landlord">Landlord</option>
            <option disabled value="agent">Property agent — arranged separately</option>
          </select>
          <p className="mock-register__field-note">Property agent accounts are arranged separately by HouseHunting.</p>
          {message && <p className="mock-register__message" role="alert">{message}</p>}
          <button type="submit">Create account</button>
        </form>
        <p className="mock-register__login">Already have an account? <Link state={{ from: location.state?.from }} to="/login">Sign in</Link>.</p>
      </section>
    </main>
  )
}

export default Register
