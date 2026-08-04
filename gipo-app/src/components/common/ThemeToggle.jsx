import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import './ThemeToggle.css'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle__track">
        <span className={`theme-toggle__thumb ${isDark ? 'is-dark' : ''}`}>
          {isDark ? <Moon size={12} strokeWidth={2.2} /> : <Sun size={12} strokeWidth={2.2} />}
        </span>
      </span>
    </button>
  )
}
