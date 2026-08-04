import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('gipo-user')
    if (saved) setUser(JSON.parse(saved))
    setLoading(false)
  }, [])

  // Replace with a real request to your auth API.
  async function login({ email, password }) {
    await new Promise((r) => setTimeout(r, 500))
    const fakeUser = { id: 'u_1', name: email.split('@')[0], email }
    localStorage.setItem('gipo-user', JSON.stringify(fakeUser))
    setUser(fakeUser)
    return fakeUser
  }

  // Replace with a real request to your auth API.
  async function signup({ name, email, password }) {
    await new Promise((r) => setTimeout(r, 500))
    const fakeUser = { id: 'u_1', name, email }
    localStorage.setItem('gipo-user', JSON.stringify(fakeUser))
    setUser(fakeUser)
    return fakeUser
  }

  function logout() {
    localStorage.removeItem('gipo-user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
