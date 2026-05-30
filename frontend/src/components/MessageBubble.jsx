import { useState } from 'react'
import CodeBlock from './CodeBlock'

function parseContent(text) {
  const parts = []
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'code', language: match[1] || 'text', content: match[2].trimEnd() })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return parts
}

function TextContent({ text }) {
  const lines = text.split('\n')
  return (
    <div style={{ lineHeight: '1.75' }}>
      {lines.map((line, i) => {
        // H1
        if (line.startsWith('# ')) return (
          <div key={i} style={{ fontWeight: 800, fontSize: '16px', color: 'var(--accent)', margin: '12px 0 6px' }}>
            {line.slice(2)}
          </div>
        )
        // H2
        if (line.startsWith('## ')) return (
          <div key={i} style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', margin: '10px 0 4px' }}>
            {line.slice(3)}
          </div>
        )
        // H3
        if (line.startsWith('### ')) return (
          <div key={i} style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', margin: '8px 0 3px' }}>
            {line.slice(4)}
          </div>
        )
        // Bullet
        if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) return (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '3px', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent)', flexShrink: 0 }}>▸</span>
            <span>{renderInline(line.slice(2))}</span>
          </div>
        )
        // Numbered list
        const numMatch = line.match(/^(\d+)\. (.+)/)
        if (numMatch) return (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '3px', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent)', flexShrink: 0, minWidth: '16px' }}>{numMatch[1]}.</span>
            <span>{renderInline(numMatch[2])}</span>
          </div>
        )
        // Empty line
        if (line.trim() === '') return <div key={i} style={{ height: '6px' }} />
        if (line.trim() === '---' || line.trim() === '***') return (
          <hr key={i} style={{
            border: 'none',
            borderTop: '1px solid var(--border)',
            margin: '10px 0'
          }}/>
        )

        return (
          <div key={i} style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>
            {renderInline(line)}
          </div>
        )
      })}
    </div>
  )
}

function renderInline(text) {
  const parts = []
  const regex = /(\*\*.*?\*\*|\*.*?\*|`[^`]+`)/g
  let last = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))

    const m = match[0]
    if (m.startsWith('**')) {
      parts.push(<strong key={match.index} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{m.slice(2, -2)}</strong>)
    } else if (m.startsWith('*')) {
      parts.push(<em key={match.index}>{m.slice(1, -1)}</em>)
    } else if (m.startsWith('`')) {
      parts.push(
        <code key={match.index} style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: '1px 6px',
          fontSize: '12px',
          fontFamily: 'monospace',
          color: 'var(--accent)'
        }}>{m.slice(1, -1)}</code>
      )
    }
    last = match.index + m.length
  }

  if (last < text.length) parts.push(text.slice(last))
  return parts.length ? parts : text
}

export default function MessageBubble({ message, onRegenerate, isLast }) {
  const isUser = message.role === 'user'
  const parts = parseContent(message.content)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fade-up"
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '20px',
        gap: '10px',
        alignItems: 'flex-start'
      }}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div style={{
          width: '32px', height: '32px',
          minWidth: '32px',
          background: 'linear-gradient(135deg, #1e3a8a, #4c1d95)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          boxShadow: '0 2px 8px rgba(79,142,247,0.3)'
        }}>
          {/* Small brain SVG */}
          <svg width="18" height="18" viewBox="0 0 64 64" fill="none">
            <path d="M32 10 C24 10 17 16 16 24 C15 30 17 34 20 37 C22 39 22 42 22 45 L32 45 L32 10Z" fill="white" opacity="0.8"/>
            <path d="M32 10 C40 10 47 16 48 24 C49 30 47 34 44 37 C42 39 42 42 42 45 L32 45 L32 10Z" fill="white" opacity="0.6"/>
            <line x1="32" y1="10" x2="32" y2="45" stroke="#4f8ef7" strokeWidth="1.5"/>
            <circle cx="20" cy="22" r="2" fill="#4f8ef7"/>
            <circle cx="44" cy="22" r="2" fill="#4f8ef7"/>
          </svg>
        </div>
      )}

      {/* Message Content */}
      <div style={{ maxWidth: isUser ? '72%' : '88%' }}>
        <div style={{
          padding: '12px 16px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
          background: isUser
            ? 'linear-gradient(135deg, #4f6ef7, #7c3aed)'
            : 'var(--bg-card)',
          border: isUser ? 'none' : '1px solid var(--border)',
          color: isUser ? '#ffffff' : 'var(--text-primary)',
          fontWeight: isUser ? 500 : 400,
          
          
          fontSize: '13px',
          boxShadow: isUser
            ? '0 4px 14px rgba(79,142,247,0.25)'
            : '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          {parts.map((part, i) =>
            part.type === 'code'
              ? <CodeBlock key={i} code={part.content} language={part.language} />
              : <TextContent key={i} text={part.content} />
          )}
        </div>

        {/* Action buttons — only for AI messages */}
        {!isUser && (
          <div style={{
            display: 'flex',
            gap: '6px',
            marginTop: '6px',
            paddingLeft: '4px'
          }}>
            {/* Copy message */}
            <button
              onClick={handleCopy}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: copied ? '#4ff7a0' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '11px',
                padding: '3px 8px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {copied ? '✓ Copied' : '⎘ Copy'}
            </button>

            {/* Regenerate — only on last AI message */}
            {isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  padding: '3px 8px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-generate)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                ↺ Regenerate
              </button>
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div style={{
          width: '32px', height: '32px',
          minWidth: '32px',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '15px'
        }}>👤</div>
      )}
    </div>
  )
}