import { motion } from 'framer-motion'
import { useChat } from '../../context/ChatContext'
import './OrchestrationPanel.css'

export default function OrchestrationPanel() {
  const { activeConversation } = useChat()
  const lastAssistant = [...(activeConversation?.messages ?? [])]
    .reverse()
    .find((m) => m.role === 'assistant')

  return (
    <motion.aside
      className="orchestration"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 className="orchestration__title">Orchestration</h2>
      <p className="orchestration__sub">How this turn got routed</p>

      {!lastAssistant ? (
        <p className="orchestration__empty">Send a message to see the pipeline.</p>
      ) : (
        <ol className="orchestration__pipeline">
          <li className="orchestration__step">
            <span className="orchestration__step-dot orchestration__step-dot--1" />
            <div>
              <span className="orchestration__step-label">Raw input</span>
              <p className="orchestration__step-desc">Your message, as typed.</p>
            </div>
          </li>
          <li className="orchestration__step">
            <span className="orchestration__step-dot orchestration__step-dot--2" />
            <div>
              <span className="orchestration__step-label">Optimized prompt</span>
              <p className="orchestration__step-desc">{lastAssistant.optimizedPrompt}</p>
            </div>
          </li>
          <li className="orchestration__step">
            <span className="orchestration__step-dot orchestration__step-dot--3" />
            <div>
              <span className="orchestration__step-label">Tool selected</span>
              <p className="orchestration__step-desc">{lastAssistant.recommendedTool}</p>
            </div>
          </li>
        </ol>
      )}
    </motion.aside>
  )
}
