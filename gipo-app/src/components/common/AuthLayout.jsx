import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import './AuthLayout.css'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__theme">
        <ThemeToggle />
      </div>

      <Link to="/" className="auth-layout__brand">
        <Logo size={150} />
      </Link>

      <motion.div
        className="auth-layout__card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="auth-layout__title">{title}</h1>
        <p className="auth-layout__subtitle">{subtitle}</p>
        {children}
        {footer && <div className="auth-layout__footer">{footer}</div>}
      </motion.div>
    </div>
  )
}
