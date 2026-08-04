import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useChat } from '../../context/ChatContext'
import './Composer.css'

export default function Composer() {
  const { sendMessage, activeConversation, profoundSearch, setProfoundSearch } = useChat()
  const [text, setText] = useState('')
  const [attachments, setAttachments] = useState([])
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  function handleFilePick(e) {
    const files = Array.from(e.target.files ?? [])
    setAttachments((prev) => [...prev, ...files])
    e.target.value = ''
  }

  function removeAttachment(index) {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim() && attachments.length === 0) return
    sendMessage(text.trim(), attachments)
    setText('')
    setAttachments([])
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  function autoGrow(e) {
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      {attachments.length > 0 && (
        <div className="composer__attachments">
          {attachments.map((file, i) => (
            <span className="composer__chip" key={i}>
              {file.name}
              <button type="button" aria-label={`Remove ${file.name}`} onClick={() => removeAttachment(i)}>
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="composer__row">
        <button
          type="button"
          className="composer__icon-btn"
          aria-label="Attach a file"
          title="Attach a file"
          onClick={() => fileInputRef.current?.click()}
        >
          <PaperclipIcon />
        </button>
        <input ref={fileInputRef} type="file" multiple hidden onChange={handleFilePick} />

        <button
          type="button"
          className={`composer__profound ${profoundSearch ? 'is-active' : ''}`}
          aria-pressed={profoundSearch}
          title="Profound Search — deep, cited web research"
          onClick={() => setProfoundSearch((v) => !v)}
        >
          <SearchIcon />
          <span>Profound Search</span>
        </button>

        <textarea
          ref={textareaRef}
          className="composer__textarea"
          placeholder={
            activeConversation
              ? 'Dump your messy idea here — GIPO will clean it up...'
              : 'Start a new conversation first'
          }
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            autoGrow(e)
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={!activeConversation}
        />

        <motion.button
          type="submit"
          className="composer__send"
          aria-label="Send message"
          disabled={!activeConversation || (!text.trim() && attachments.length === 0)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
        >
          <SendIcon />
        </motion.button>
      </div>
    </form>
  )
}

function PaperclipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21.44 11.05 12.25 20.24a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2 11 13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  )
}
