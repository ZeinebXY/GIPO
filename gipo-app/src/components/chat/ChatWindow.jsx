import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useChat } from '../../context/ChatContext'
import MessageBubble from './MessageBubble'
import IridescentLoader from '../common/IridescentLoader'
import './ChatWindow.css'

export default function ChatWindow() {
  const { activeConversation, isThinking } = useChat()
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [activeConversation?.messages?.length, isThinking])

  if (!activeConversation) {
    return (
      <div className="chat-window chat-window--empty">
        <p>Start a new conversation to see it here.</p>
      </div>
    )
  }

  if (activeConversation.messages.length === 0) {
    return (
      <motion.div
        className="chat-window chat-window--empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="chat-window__empty-title">Hand GIPO your messiest idea.</p>
        <p className="chat-window__empty-sub">
          It'll come back as a sharp prompt, routed to the tool built for the job.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="chat-window" ref={scrollRef}>
      <div className="chat-window__inner">
        <AnimatePresence initial={false}>
          {activeConversation.messages.map((m, i) => (
            <MessageBubble key={i} message={m} />
          ))}
        </AnimatePresence>
        {isThinking && <IridescentLoader />}
      </div>
    </div>
  )
}
