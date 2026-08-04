import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import Logo from '../components/common/Logo'
import ThemeToggle from '../components/common/ThemeToggle'
import './LandingPage.css'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <header className="landing__header">
        <Link to="/" className="landing__brand">
          <Logo size={72} />
        </Link>
        <div className="landing__nav-actions">
          <ThemeToggle />
          <Link to="/login" className="landing__login-link">Log in</Link>
          <Link to="/signup" className="btn-primary landing__signup-cta">Sign up</Link>
        </div>
      </header>

      <main className="landing__hero">
        <motion.div
          className="landing__hero-logo"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Logo size={350} />
        </motion.div>

        <motion.p
          className="landing__eyebrow"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          AI orchestration, not another chatbot
        </motion.p>

        <motion.h1
          className="landing__headline"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          Dump the mess. Get back a{' '}
          <span className="landing__headline-accent">sharp prompt</span>.
        </motion.h1>

        <motion.p
          className="landing__sub"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          GIPO takes your half-formed idea, turns it into an optimized prompt, and routes it
          to whichever AI tool actually fits the job so you stop guessing which model to use.
        </motion.p>

        <motion.div
          className="landing__ctas"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          <button className="btn-primary landing__get-started" onClick={() => navigate('/signup')}>
            Get started <ArrowRight size={16} />
          </button>
          <button className="landing__secondary" onClick={() => navigate('/login')}>
            I already have an account
          </button>
        </motion.div>

        <motion.div
          className="landing__demo"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
        >
          <div className="landing__demo-label gold-label">
            <Sparkles size={16} />
            <span>See it work</span>
          </div>
          <p className="landing__demo-raw">
            "ok so basically i need like a landing page thing for the app but make it sound good idk something punchy"
          </p>
          <div className="landing__demo-divider" />
          <p className="landing__demo-optimized">
            → "Write landing-page copy (headline, subhead, 3 bullets) in a punchy, confident tone for first-time visitors."
          </p>
          <span className="landing__demo-tool">Routed to: Claude — long-form copywriting</span>
        </motion.div>
      </main>
    </div>
  )
}
