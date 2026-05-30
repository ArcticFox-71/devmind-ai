import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import Logo from '../assets/Logo'

function WelcomeScreen({ mode, onExampleClick }) {
  const modeInfo = {
    chat: {
      icon: '💬',
      title: 'Chat Mode',
      color: 'var(--color-chat)',
      desc: 'Ask anything about code, concepts, or best practices',
      examples: [
        'How do I reverse a string in Python?',
        'Explain async/await in JavaScript',
        'What is Big O notation?',
        'How does React useState work?'
      ]
    },
    debug: {
      icon: '🐛',
      title: 'Debug Mode',
      color: 'var(--color-debug)',
      desc: 'Paste broken code or error messages — I will fix them',
      examples: [
        'TypeError: Cannot read property of undefined',
        'My for loop runs infinitely, help!',
        'SyntaxError: Unexpected token in JSON',
        'My API returns 404 but the route exists'
      ]
    },
    generate: {
      icon: '⚡',
      title: 'Generate Mode',
      color: 'var(--color-generate)',
      desc: 'Describe what you need — I will write the code',
      examples: [
        'Generate a REST API with FastAPI',
        'Write a binary search algorithm',
        'Create a React todo app component',
        'Build a Python web scraper'
      ]
    },
    explain: {
      icon: '📖',
      title: 'Explain Mode',
      color: 'var(--color-explain)',
      desc: 'Paste any code — I will explain it line by line',
      examples: [
        'Explain this recursive function',
        'What does this regex pattern do?',
        'Break down this sorting algorithm',
        'Explain this SQL query step by step'
      ]
    }
  }

  const info = modeInfo[mode] || modeInfo.chat

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      gap: '28px'
    }}>
      {/* Logo + Title */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(79,142,247,0.3)'
          }}>
            <Logo size={44} />
          </div>
        </div>
        <h1 style={{
          fontSize: '26px',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '6px',
          letterSpacing: '-0.5px'
        }}>
          DevMind AI
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-muted)'
        }}>
          Your intelligent coding assistant
        </p>
      </div>

      {/* Mode Card */}
      <div style={{
        background: 'var(--bg-card)',
        border: `1px solid ${info.color}44`,
        borderRadius: '16px',
        padding: '20px 24px',
        maxWidth: '480px',
        width: '100%',
        boxShadow: `0 4px 24px ${info.color}11`
      }}>
        {/* Mode header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '14px'
        }}>
          <div style={{
            width: '36px', height: '36px',
            background: `${info.color}22`,
            border: `1px solid ${info.color}44`,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            {info.icon}
          </div>
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: 700,
              color: info.color
            }}>
              {info.title}
            </div>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-muted)'
            }}>
              {info.desc}
            </div>
          </div>
        </div>

        {/* Example prompts — CLICKABLE */}
        <div style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          fontWeight: 600
        }}>
          Try these examples:
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {info.examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => onExampleClick(ex)}
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '12px',
                textAlign: 'left',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = info.color
                e.currentTarget.style.color = info.color
                e.currentTarget.style.background = `${info.color}11`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.background = 'var(--bg-tertiary)'
              }}
            >
              <span style={{ color: info.color, fontSize: '10px' }}>▸</span>
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom hint */}
      <div style={{
        fontSize: '11px',
        color: 'var(--text-muted)',
        textAlign: 'center',
        display: 'flex',
        gap: '16px'
      }}>
        <span>🎤 Voice input</span>
        <span>📎 Image upload</span>
        <span>⌘V Paste screenshot</span>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="fade-up" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '20px'
    }}>
      <div style={{
        width: '32px', height: '32px',
        background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        boxShadow: '0 2px 8px rgba(79,142,247,0.3)'
      }}>
        <svg width="18" height="18" viewBox="0 0 64 64" fill="none">
          <path d="M32 10 C24 10 17 16 16 24 C15 30 17 34 20 37 C22 39 22 42 22 45 L32 45 L32 10Z" fill="white" opacity="0.8"/>
          <path d="M32 10 C40 10 47 16 48 24 C49 30 47 34 44 37 C42 39 42 42 42 45 L32 45 L32 10Z" fill="white" opacity="0.6"/>
          <line x1="32" y1="10" x2="32" y2="45" stroke="#4f8ef7" strokeWidth="1.5"/>
        </svg>
      </div>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '4px 18px 18px 18px',
        padding: '12px 16px',
        display: 'flex',
        gap: '5px',
        alignItems: 'center'
      }}>
        <div className="typing-dot"/>
        <div className="typing-dot"/>
        <div className="typing-dot"/>
      </div>
    </div>
  )
}

export default function ChatWindow({ messages, isLoading, mode, onExampleClick, onRegenerate }) {
  const bottomRef = useRef(null)


const lastUserRef = useRef(null)

useEffect(() => {
  if (messages.length === 0) return
  const lastMsg = messages[messages.length - 1]
  if (lastMsg.role === 'user') {
    // When user sends — scroll to their message
    lastUserRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else if (lastMsg.role === 'assistant' && !isLoading) {
    // When AI responds — scroll to TOP of AI response not bottom
    lastUserRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}, [messages, isLoading])

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '20px 24px'
    }}>
      {messages.length === 0
        ? <WelcomeScreen mode={mode} onExampleClick={onExampleClick} />
        : (
          <>
            {messages.map((msg, i) => {
  const isLastUser = msg.role === 'user' && 
    messages.slice(i + 1).every(m => m.role === 'assistant')
  return (
    <div key={i} ref={isLastUser ? lastUserRef : null}>
      <MessageBubble
        message={msg}
        isLast={i === messages.length - 1 && msg.role === 'assistant'}
        onRegenerate={onRegenerate}
      />
    </div>
  )
})}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} style={{ height: '1px' }} />
          </>
        )
      }
    </div>
  )
}