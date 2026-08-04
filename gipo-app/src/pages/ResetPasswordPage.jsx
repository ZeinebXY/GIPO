import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/common/AuthLayout'
import '../components/common/AuthForm.css'

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [form, setForm] = useState({ password: '', confirm: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  function updateField(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('This link is missing its token. Request a new one.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (form.password !== form.confirm) {
      setError("Passwords don't match.")
      return
    }

    setSubmitting(true)
    try {
      await resetPassword({ token, newPassword: form.password })
      setDone(true)
    } catch (err) {
      setError(err.message || 'This link may have expired. Request a new one.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <AuthLayout
        title="Invalid link"
        subtitle="This password reset link is missing or malformed."
        footer={<Link to="/forgot-password">Request a new link</Link>}
      >
        <></>
      </AuthLayout>
    )
  }

  if (done) {
    return (
      <AuthLayout
        title="Password updated"
        subtitle="You can now log in with your new password."
        footer={null}
      >
        <button className="btn-primary auth-form__submit" onClick={() => navigate('/login')}>
          Go to log in
        </button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Make it at least 8 characters."
      footer={
        <>
          Remembered your old one? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-form__field">
          <span>New password</span>
          <input
            type="password"
            value={form.password}
            onChange={updateField('password')}
            autoComplete="new-password"
            autoFocus
          />
        </label>
        <label className="auth-form__field">
          <span>Confirm new password</span>
          <input
            type="password"
            value={form.confirm}
            onChange={updateField('confirm')}
            autoComplete="new-password"
          />
        </label>

        {error && <p className="auth-form__error">{error}</p>}

        <button type="submit" className="btn-primary auth-form__submit" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </AuthLayout>
  )
}
