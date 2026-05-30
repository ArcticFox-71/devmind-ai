import { useState, useEffect } from 'react'
import Logo from '../assets/Logo'
import { getSessions, deleteSession } from '../utils/api'

export default function Sidebar({ currentSessionId, onSelectSession, onNewChat, theme, onToggleTheme }) {
  const [sessions, setSessions] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadSessions()
  }, [currentSessionId])

  const loadSessions = async () => {
    try {
      const data = await getSessions()
      setSessions(data)
    } catch (err) {
      console.error('Failed to load sessions:', err)
    }
  }

  const handleDelete = async (e, sessionId) => {
    e.stopPropagation()
    try {
      await deleteSession(sessionId)
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      if (currentSessionId === sessionId) onNewChat()
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  const modeColor = {
    chat: 'var(--color-chat)',
    debug: 'var(--color-debug)',
    generate: 'var(--color-generate)',
    explain: 'var(--color-explain)'
  }

  const modeIcon = {
    chat: '💬',
    debug: '🐛',
    generate: '⚡',
    explain: '📖'
  }

  const filtered = sessions.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{
      width: '260px',
      minWidth: '260px',
      height: '100vh',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>

      {/* ── Logo ── */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <Logo size={36} />
        <div>
          <div style={{
            fontWeight: 800,
            fontSize: '15px',
            background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.3px'
          }}>DevMind AI</div>
          <div style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase'
          }}>Code Intelligence</div>
        </div>
      </div>

      {/* ── New Chat Button ── */}
      <div style={{ padding: '12px' }}>
        <button
          onClick={onNewChat}
          style={{
            width: '100%',
            padding: '10px',
            background: 'linear-gradient(135deg, #4f8ef722, #7c3aed22)',
            border: '1px solid #4f8ef755',
            borderRadius: '10px',
            color: 'var(--accent)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #4f8ef7, #7c3aed)'
            e.currentTarget.style.color = 'white'
            e.currentTarget.style.border = '1px solid transparent'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #4f8ef722, #7c3aed22)'
            e.currentTarget.style.color = 'var(--accent)'
            e.currentTarget.style.border = '1px solid #4f8ef755'
          }}
        >
          ✦ New Chat
        </button>
      </div>

      {/* ── Search ── */}
      <div style={{ padding: '0 12px 10px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '7px 10px'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search chats..."
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '12px',
              width: '100%',
              fontFamily: 'inherit'
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '12px',
                padding: 0
              }}
            >✕</button>
          )}
        </div>
      </div>

      {/* ── Sessions List ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 8px'
      }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '12px',
            marginTop: '24px',
            lineHeight: '1.8',
            padding: '0 16px'
          }}>
            {search ? '🔍 No chats found' : 'No chats yet.\nStart a new conversation!'}
          </div>
        ) : (
          filtered.map(session => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className="slide-in"
              style={{
                padding: '9px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '2px',
                background: currentSessionId === session.id
                  ? 'var(--bg-tertiary)' : 'transparent',
                border: currentSessionId === session.id
                  ? '1px solid var(--border)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s',
                position: 'relative'
              }}
              onMouseEnter={e => {
                if (currentSessionId !== session.id)
                  e.currentTarget.style.background = 'var(--bg-tertiary)'
                const btn = e.currentTarget.querySelector('.del-btn')
                if (btn) btn.style.opacity = '1'
              }}
              onMouseLeave={e => {
                if (currentSessionId !== session.id)
                  e.currentTarget.style.background = 'transparent'
                const btn = e.currentTarget.querySelector('.del-btn')
                if (btn) btn.style.opacity = '0'
              }}
            >
              <span style={{ fontSize: '13px' }}>
                {modeIcon[session.mode] || '💬'}
              </span>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {session.title}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: modeColor[session.mode] || 'var(--text-muted)',
                  textTransform: 'capitalize',
                  marginTop: '2px'
                }}>
                  {session.mode}
                </div>
              </div>
              <button
                className="del-btn"
                onClick={e => handleDelete(e, session.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  flexShrink: 0
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#f74f4f'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >✕</button>
            </div>
          ))
        )}
      </div>

      {/* ── Bottom Controls ── */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <button
          onClick={onToggleTheme}
          style={{
            width: '100%',
            padding: '8px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </div>
  )
}