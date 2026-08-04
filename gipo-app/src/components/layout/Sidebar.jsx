import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useChat } from '../../context/ChatContext'
import { useAuth } from '../../context/AuthContext'
import { useTransition } from '../../context/TransitionContext'
import ThemeToggle from '../common/ThemeToggle'
import Logo from '../common/Logo'
import './Sidebar.css'

export default function Sidebar() {
  const {
    conversations,
    activeId,
    setActiveId,
    newConversation,
    renameConversation,
    deleteConversation,
    query,
    setQuery,
  } = useChat()
  const { user, logout } = useAuth()
  const { runTransition } = useTransition()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [draftTitle, setDraftTitle] = useState('')

  function startEditing(conv) {
    setEditingId(conv.id)
    setDraftTitle(conv.title)
  }

  function commitEditing() {
    if (editingId) renameConversation(editingId, draftTitle)
    setEditingId(null)
  }

  function handleLogout() {
    setMenuOpen(false)
    runTransition(() => {
      logout()
      navigate('/')
    }, { message: 'Signing you out', duration: 800 })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <Logo size={150} />
      </div>

      <button className="sidebar__new-chat" onClick={newConversation}>
        <span className="sidebar__new-chat-plus">+</span>
        New conversation
      </button>

      <div className="sidebar__search">
        <input
          type="text"
          placeholder="Search conversations"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search conversations"
        />
      </div>

      <nav className="sidebar__list" aria-label="Conversations">
        {conversations.length === 0 && (
          <p className="sidebar__empty">No conversations match yet.</p>
        )}
        <AnimatePresence initial={false}>
          {conversations.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`sidebar__item ${c.id === activeId ? 'sidebar__item--active' : ''}`}
            >
              {editingId === c.id ? (
                <input
                  className="sidebar__item-edit"
                  value={draftTitle}
                  autoFocus
                  onChange={(e) => setDraftTitle(e.target.value)}
                  onBlur={commitEditing}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitEditing()
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                />
              ) : (
                <button className="sidebar__item-title" onClick={() => setActiveId(c.id)}>
                  {c.title}
                </button>
              )}

              <div className="sidebar__item-actions">
                <button
                  className="sidebar__item-action"
                  aria-label={`Rename "${c.title}"`}
                  title="Rename"
                  onClick={() => startEditing(c)}
                >
                  <PencilIcon />
                </button>
                <button
                  className="sidebar__item-action"
                  aria-label={`Delete "${c.title}"`}
                  title="Delete"
                  onClick={() => deleteConversation(c.id)}
                >
                  <TrashIcon />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </nav>

      <div className="sidebar__footer">
        <ThemeToggle />

        {user ? (
          <div className="sidebar__user">
            <button className="sidebar__user-btn" onClick={() => setMenuOpen((v) => !v)}>
              <span className="sidebar__avatar">{user.name?.[0]?.toUpperCase() ?? '?'}</span>
              <span className="sidebar__user-name">{user.name}</span>
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  className="sidebar__user-menu"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.16 }}
                >
                  <button onClick={handleLogout}>Log out</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="sidebar__auth-actions">
            <button className="sidebar__auth-link" onClick={() => navigate('/login')}>
              Log in
            </button>
            <button className="btn-primary sidebar__auth-cta" onClick={() => navigate('/signup')}>
              Sign up
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
