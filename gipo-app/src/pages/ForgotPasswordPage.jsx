import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/common/AuthLayout'
import '../components/common/AuthForm.css'

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Enter your email address.')
      return
    }
    setSubmitting(true)
    try {
      await forgotPassword({ email })
      setSent(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="If an account exists for that address, we've sent a link to reset your password. It expires in 30 minutes."
        footer={<Link to="/login">Back to log in</Link>}
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          Didn't get it? Check your spam folder, or{' '}
          <button
            type="button"
            onClick={() => setSent(false)}
            style={{ textDecoration: 'underline', color: 'var(--accent-solid)' }}
          >
            try again
          </button>
          .
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the email on your account and we'll send you a reset link."
      footer={
        <>
          Remembered it? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-form__field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
          />
        </label>

        {error && <p className="auth-form__error">{error}</p>}

        <button type="submit" className="btn-primary auth-form__submit" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
    </AuthLayout>
  )
}
