import { createContext, useContext, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingOverlay from '../components/common/LoadingOverlay'

const TransitionContext = createContext(null)

export function TransitionProvider({ children }) {
  const [active, setActive] = useState(false)
  const [label, setLabel] = useState('')

  /**
   * Shows the logo + loading bar, runs `after` (typically a navigate()
   * call) once the bar has filled, then fades the overlay out.
   */
  function runTransition(after, { duration = 1000, message = 'Getting things ready' } = {}) {
    setLabel(message)
    setActive(true)
    setTimeout(() => {
      after?.()
      setTimeout(() => setActive(false), 260)
    }, duration)
  }

  return (
    <TransitionContext.Provider value={{ runTransition }}>
      {children}
      <AnimatePresence>{active && <LoadingOverlay key="loading" message={label} />}</AnimatePresence>
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error('useTransition must be used inside TransitionProvider')
  return ctx
}
