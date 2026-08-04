import { motion } from 'framer-motion'

const dotVariants = {
  animate: (delay) => ({
    scale: [0.7, 1.15, 0.7],
    opacity: [0.5, 1, 0.5],
    transition: { duration: 1.1, repeat: Infinity, delay, ease: 'easeInOut' },
  }),
}

export default function IridescentLoader({ label = 'GIPO is orchestrating' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px' }} role="status" aria-live="polite">
      <motion.span custom={0} variants={dotVariants} animate="animate" style={dotStyle('var(--gipo-dot-gold)')} />
      <motion.span custom={0.15} variants={dotVariants} animate="animate" style={dotStyle('var(--gipo-dot-azure)')} />
      <motion.span custom={0.3} variants={dotVariants} animate="animate" style={dotStyle('var(--gipo-dot-amethyst)')} />
      <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 4 }}>{label}</span>
    </div>
  )
}

function dotStyle(color) {
  return { width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }
}
