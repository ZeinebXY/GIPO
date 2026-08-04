import { motion } from 'framer-motion'
import './MessageBubble.css'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      className={`bubble-row ${isUser ? 'bubble-row--user' : 'bubble-row--assistant'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`bubble ${isUser ? 'bubble--user' : 'bubble--assistant'}`}>
        {!isUser && message.optimizedPrompt && (
          <div className="bubble__optimized">
            <span className="bubble__optimized-label">Optimized prompt</span>
            <p className="bubble__optimized-text">{message.optimizedPrompt}</p>
            {message.recommendedTool && (
              <span className="bubble__tool-chip">{message.recommendedTool}</span>
            )}
          </div>
        )}

        <p className="bubble__content">{message.content}</p>

        {message.attachments?.length > 0 && (
          <ul className="bubble__attachments">
            {message.attachments.map((file, i) => (
              <li key={i} className="bubble__attachment">{file.name}</li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  )
}
