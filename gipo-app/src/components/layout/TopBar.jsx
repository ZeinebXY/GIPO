import { useChat } from '../../context/ChatContext'
import './TopBar.css'

export default function TopBar({ showOrchestration, onToggleOrchestration }) {
  const { activeConversation } = useChat()

  return (
    <header className="topbar">
      <h1 className="topbar__title">
        {activeConversation?.title ?? 'Select a conversation'}
      </h1>
      <button
        className={`topbar__orchestration-toggle ${showOrchestration ? 'is-active' : ''}`}
        onClick={onToggleOrchestration}
        aria-pressed={showOrchestration}
      >
        Orchestration
      </button>
    </header>
  )
}
