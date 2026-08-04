import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL

async function parseErrorMessage(res) {
  try {
    const data = await res.json()
    return data.detail || 'Something went wrong.'
  } catch {
    return 'Something went wrong.'
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('gipo-user')
    const savedToken = localStorage.getItem('gipo-token')
    if (savedUser && savedToken) setUser(JSON.parse(savedUser))
    setLoading(false)
  }, [])

  // Creates the account on the backend. The account is NOT logged in yet —
  // the user still has to click the verification link emailed to them.
  // Resolves to { message } on success.
  async function signup({ name, email, password }) {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    if (!res.ok) throw new Error(await parseErrorMessage(res))
    return res.json()
  }

  // Logs in a verified account. Throws if the email/password is wrong or
  // the account hasn't been verified yet.
  async function login({ email, password }) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error(await parseErrorMessage(res))

    const data = await res.json() // { access_token, token_type, user }
    localStorage.setItem('gipo-token', data.access_token)
    localStorage.setItem('gipo-user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  // Sends a reset-password email if the address is registered. Always
  // resolves the same way — the backend doesn't reveal whether the email
  // exists, so don't use this to validate emails against real accounts.
  async function forgotPassword({ email }) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) throw new Error(await parseErrorMessage(res))
    return res.json()
  }

  // Completes a reset using the token from that email.
  async function resetPassword({ token, newPassword }) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, new_password: newPassword }),
    })
    if (!res.ok) throw new Error(await parseErrorMessage(res))
    return res.json()
  }

  // Confirms the account's email using the token from the signup email.
  async function verifyEmail({ token }) {
    const res = await fetch(`${API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`)
    if (!res.ok) throw new Error(await parseErrorMessage(res))
    return res.json()
  }

  function logout() {
    localStorage.removeItem('gipo-user')
    localStorage.removeItem('gipo-token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, forgotPassword, resetPassword, verifyEmail }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
