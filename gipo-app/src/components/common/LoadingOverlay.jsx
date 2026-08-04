import { motion } from 'framer-motion'
import Logo from './Logo'
import './LoadingOverlay.css'

export default function LoadingOverlay({ message = 'Getting things ready' }) {
  return (
    <motion.div
      className="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Logo size={150} glow />
      <div className="loading-overlay__bar-track">
        <div className="loading-overlay__bar-fill" />
      </div>
      <p className="loading-overlay__message">{message}</p>
    </motion.div>
  )
}
