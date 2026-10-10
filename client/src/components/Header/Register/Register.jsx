import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../../store/authStore'
import './register.css'

const Register = () => {
  const navigate = useNavigate()
  const registerMockUser = useAuthStore((state) => state.registerMockUser)
  const [form, setForm] = useState({ name: '', email: '', role: 'tenant' })
  const [message, setMessage] = useState('')
  const [registeredRole, setRegisteredRole] = useState('')

  useEffect(() => {
    if (!registeredRole) return undefined

    const redirect = window.setTimeout(() => {
      navigate(registeredRole === 'landlord' ? '/my-listings' : '/', { replace: true })
    }, 650)

    return () => window.clearTimeout(redirect)
  }, [navigate, registeredRole])

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = registerMockUser(form)

    if (!result.ok) {
      setMessage(result.message)
      return
    }

    setMessage(`Mock ${result.user.role} account created. You are now signed in and will be redirected shortly.`)
    setRegisteredRole(result.user.role)
  }

  return (
    <main className="mock-register">
      <section className="container mock-register__card" aria-labelledby="mock-register-title">
        <p className="mock-register__eyebrow">Frontend-only account</p>
        <h1 id="mock-register-title">Create a mock account</h1>
        <p>Registration is for this browser session only. Choose tenant or landlord; agent accounts are assigned separately.</p>
        <form className="mock-register__form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="register-name">Name</label>
          <input id="register-name" name="name" onChange={(event) => { setForm({ ...form, name: event.target.value }); setMessage('') }} value={form.name} />
          <label htmlFor="register-email">Email address</label>
          <input autoComplete="email" id="register-email" name="email" onChange={(event) => { setForm({ ...form, email: event.target.value }); setMessage('') }} type="email" value={form.email} />
          <label htmlFor="register-role">Account type</label>
          <select id="register-role" name="role" onChange={(event) => setForm({ ...form, role: event.target.value })} value={form.role}>
            <option value="tenant">Tenant</option>
            <option value="landlord">Landlord</option>
          </select>
          {message && <p className="mock-register__message" role={registeredRole ? 'status' : 'alert'}>{message}</p>}
          <button disabled={Boolean(registeredRole)} type="submit">Create mock account</button>
        </form>
        <p className="mock-register__login">Already have a demo account? <Link to="/login">Sign in</Link>.</p>
      </section>
    </main>
  )
}

export default Register
