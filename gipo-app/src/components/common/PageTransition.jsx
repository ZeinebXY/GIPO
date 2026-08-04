import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ height: '100%' }}
    >
      {children}
    </motion.div>
  )
}
