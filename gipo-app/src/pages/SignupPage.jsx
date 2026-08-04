import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/common/AuthLayout'
import '../components/common/AuthForm.css'

export default function SignupPage() {
  const { signup } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  function updateField(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) {
      setError('Tell us what to call you.')
      return
    }
    if (!form.email.trim() || !form.password.trim()) {
      setError('Email and password are required.')
      return
    }
    setSubmitting(true)
    try {
      await signup(form)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle={`We sent a verification link to ${form.email}. Click it to activate your account, then come back and log in.`}
        footer={
          <>
            Already verified? <Link to="/login">Log in</Link>
          </>
        }
      >
        <></>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start turning messy ideas into sharp prompts."
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-form__field">
          <span>Name</span>
          <input type="text" value={form.name} onChange={updateField('name')} autoComplete="name" />
        </label>
        <label className="auth-form__field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={updateField('email')} autoComplete="email" />
        </label>
        <label className="auth-form__field">
          <span>Password</span>
          <input type="password" value={form.password} onChange={updateField('password')} autoComplete="new-password" />
        </label>

        {error && <p className="auth-form__error">{error}</p>}

        <button type="submit" className="btn-primary auth-form__submit" disabled={submitting}>
          {submitting ? 'Please wait...' : 'Sign up'}
        </button>
      </form>
    </AuthLayout>
  )
}
