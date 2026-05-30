import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import InputBar from './components/InputBar'
import ModeSelector from './components/ModeSelector'
import { sendMessage, analyzeImage, getMessages } from './utils/api'

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [mode, setMode] = useState('chat')
  const [messages, setMessages] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState('Auto')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    document.documentElement.className = theme === 'light' ? 'light' : ''
  }, [theme])

  const toggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark')

  const handleNewChat = () => {
    setMessages([])
    setSessionId(null)
  }

  const handleSelectSession = async (id) => {
    try {
      const msgs = await getMessages(id)
      setMessages(msgs)
      setSessionId(id)
    } catch (err) {
      console.error('Failed to load session:', err)
    }
  }

  const handleExampleClick = (example) => {
    handleSend(example, language)
  }

  const handleSend = async (text, lang) => {
    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const data = await sendMessage(text, mode, sessionId, lang || language)
      setSessionId(data.session_id)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ **Error:** Could not reach backend.\n\nMake sure your backend server is running:\n```bash\nuvicorn main:app --reload\n```'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerate = async () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')
    if (!lastUserMsg) return
    setMessages(prev => {
      const copy = [...prev]
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === 'assistant') {
          copy.splice(i, 1)
          break
        }
      }
      return copy
    })
    setIsLoading(true)
    try {
      const data = await sendMessage(lastUserMsg.content, mode, sessionId, language)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ **Error:** Regeneration failed. Please try again.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageSend = async (file, question, currentMode, lang) => {
    const userMsg = {
      role: 'user',
      content: `📎 **Image uploaded**\n\n${question}`
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)
    try {
      const data = await analyzeImage(file, question, currentMode)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ **Error:** Could not analyze image. Please try again.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'var(--bg-primary)',
      overflow: 'hidden'
    }}>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(p => !p)}
        style={{
          position: 'fixed',
          top: '50%',
          left: sidebarOpen ? '248px' : '8px',
          transform: 'translateY(-50%)',
          zIndex: 100,
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          padding: '8px 6px',
          fontSize: '12px',
          transition: 'left 0.25s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
        title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? '◀' : '▶'}
      </button>

      {/* Left Sidebar */}
      <div style={{
        width: sidebarOpen ? '260px' : '0px',
        minWidth: sidebarOpen ? '260px' : '0px',
        overflow: 'hidden',
        transition: 'width 0.25s ease, min-width 0.25s ease'
      }}>
        <Sidebar
          currentSessionId={sessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>

      {/* Main Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg-primary)'
      }}>
        <ModeSelector
          currentMode={mode}
          onModeChange={(newMode) => {
            setMode(newMode)
            if (!sessionId) setMessages([])
          }}
        />

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          mode={mode}
          onExampleClick={handleExampleClick}
          onRegenerate={handleRegenerate}
        />

        <InputBar
          onSend={handleSend}
          onImageSend={handleImageSend}
          isLoading={isLoading}
          mode={mode}
          language={language}
          onLanguageChange={setLanguage}
        />
      </div>
    </div>
  )
}