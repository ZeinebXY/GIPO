import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTransition } from '../context/TransitionContext'
import AuthLayout from '../components/common/AuthLayout'
import '../components/common/AuthForm.css'

export default function LoginPage() {
  const { login } = useAuth()
  const { runTransition } = useTransition()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateField(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.email.trim() || !form.password.trim()) {
      setError('Email and password are required.')
      return
    }
    setSubmitting(true)
    try {
      await login(form)
      setSubmitting(false)
      runTransition(() => navigate('/chat'), { message: 'Signing you in' })
    } catch {
      setError('Something went wrong. Try again.')
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to pick up where you left off."
      footer={
        <>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-form__field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={updateField('email')} autoComplete="email" />
        </label>
        <label className="auth-form__field">
          <span>Password</span>
          <input type="password" value={form.password} onChange={updateField('password')} autoComplete="current-password" />
        </label>

        {error && <p className="auth-form__error">{error}</p>}

        <button type="submit" className="btn-primary auth-form__submit" disabled={submitting}>
          {submitting ? 'Please wait...' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  )
}
