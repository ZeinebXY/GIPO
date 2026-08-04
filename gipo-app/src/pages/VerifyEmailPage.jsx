import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/common/AuthLayout'

export default function VerifyEmailPage() {
  const { verifyEmail } = useAuth()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState('verifying') // 'verifying' | 'success' | 'error'
  const [error, setError] = useState('')
  const ranOnce = useRef(false)

  useEffect(() => {
    if (ranOnce.current) return
    ranOnce.current = true

    if (!token) {
      setStatus('error')
      setError('This link is missing its token.')
      return
    }

    verifyEmail({ token })
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error')
        setError(err.message || 'This link may have expired.')
      })
  }, [token, verifyEmail])

  if (status === 'verifying') {
    return (
      <AuthLayout title="Verifying your email" subtitle="One moment..." footer={null}>
        <></>
      </AuthLayout>
    )
  }

  if (status === 'success') {
    return (
      <AuthLayout
        title="Email verified"
        subtitle="Your account is ready. You can log in now."
        footer={null}
      >
        <Link to="/login" className="btn-primary auth-form__submit" style={{ display: 'inline-flex' }}>
          Go to log in
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Verification failed" subtitle={error} footer={null}>
      <Link to="/signup" className="btn-primary auth-form__submit" style={{ display: 'inline-flex' }}>
        Back to sign up
      </Link>
    </AuthLayout>
  )
}
