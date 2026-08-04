import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'
import ChatWindow from '../components/chat/ChatWindow'
import Composer from '../components/chat/Composer'
import OrchestrationPanel from '../components/orchestration/OrchestrationPanel'

export default function ChatPage() {
  const [showOrchestration, setShowOrchestration] = useState(true)

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-column">
        <TopBar
          showOrchestration={showOrchestration}
          onToggleOrchestration={() => setShowOrchestration((v) => !v)}
        />
        <ChatWindow />
        <Composer />
      </main>
      <AnimatePresence>
        {showOrchestration && <OrchestrationPanel key="orchestration" />}
      </AnimatePresence>
    </div>
  )
}
