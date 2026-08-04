import { createContext, useContext, useMemo, useState } from 'react'

const ChatContext = createContext(null)

let idCounter = 1
const nextId = () => `c_${idCounter++}`

const SEED_CONVERSATIONS = [
  {
    id: nextId(),
    title: 'Landing page copy from a voice memo',
    messages: [
      {
        role: 'user',
        content:
          "ok so basically i need like a landing page thing for the app but make it sound good idk something punchy",
        attachments: [],
      },
      {
        role: 'assistant',
        optimizedPrompt:
          'Write landing-page copy (headline, subhead, 3 feature bullets) for a mobile app, in a punchy, confident tone aimed at first-time visitors.',
        recommendedTool: 'Claude — long-form copywriting',
        content:
          'Here is a first pass at your landing page copy:\n\nHeadline: Get there faster.\nSubhead: The app that turns your to-do list into a done list.',
        attachments: [],
      },
    ],
  },
]

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState(SEED_CONVERSATIONS)
  const [activeId, setActiveId] = useState(SEED_CONVERSATIONS[0].id)
  const [isThinking, setIsThinking] = useState(false)
  const [query, setQuery] = useState('')
  const [profoundSearch, setProfoundSearch] = useState(false)

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  )

  const filteredConversations = useMemo(() => {
    if (!query.trim()) return conversations
    const q = query.toLowerCase()
    return conversations.filter((c) => c.title.toLowerCase().includes(q))
  }, [conversations, query])

  function newConversation() {
    const conv = { id: nextId(), title: 'New conversation', messages: [] }
    setConversations((prev) => [conv, ...prev])
    setActiveId(conv.id)
  }

  function renameConversation(id, title) {
    const clean = title.trim()
    if (!clean) return
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title: clean } : c)))
  }

  function deleteConversation(id) {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (activeId === id) {
      const remaining = conversations.filter((c) => c.id !== id)
      setActiveId(remaining[0]?.id ?? null)
    }
  }

  // Mocked "garbage in -> prompt out" transformation. Replace with a real
  // orchestration API call that returns the optimized prompt + tool choice.
  function fakeOrchestrate(rawText) {
    const optimizedPrompt =
      rawText.trim().length > 60 ? rawText.trim().slice(0, 57) + '...' : rawText.trim()
    const tools = profoundSearch
      ? ['Perplexity — deep web research', 'Claude — cited synthesis']
      : ['Claude — reasoning & writing', 'GPT-4o — vision & code']
    const recommendedTool = tools[rawText.length % tools.length]
    return { optimizedPrompt, recommendedTool }
  }

  function sendMessage(rawText, attachments = []) {
    if (!activeConversation) return
    const userMessage = { role: 'user', content: rawText, attachments }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              title: c.messages.length === 0 ? rawText.slice(0, 40) : c.title,
              messages: [...c.messages, userMessage],
            }
          : c
      )
    )

    setIsThinking(true)
    setTimeout(() => {
      const { optimizedPrompt, recommendedTool } = fakeOrchestrate(rawText)
      const reply = {
        role: 'assistant',
        optimizedPrompt,
        recommendedTool,
        content: `Routed through ${recommendedTool}. Here's a response shaped around the optimized prompt above.`,
        attachments: [],
      }
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, reply] } : c))
      )
      setIsThinking(false)
    }, 1100)
  }

  return (
    <ChatContext.Provider
      value={{
        conversations: filteredConversations,
        activeConversation,
        activeId,
        setActiveId,
        newConversation,
        renameConversation,
        deleteConversation,
        sendMessage,
        isThinking,
        query,
        setQuery,
        profoundSearch,
        setProfoundSearch,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used inside ChatProvider')
  return ctx
}
