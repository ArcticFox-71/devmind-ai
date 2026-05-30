export default function ModeSelector({ currentMode, onModeChange }) {
  const modes = [
    {
      id: 'chat',
      label: 'Chat',
      icon: '💬',
      color: 'var(--color-chat)',
      desc: 'General coding help'
    },
    {
      id: 'debug',
      label: 'Debug',
      icon: '🐛',
      color: 'var(--color-debug)',
      desc: 'Fix broken code'
    },
    {
      id: 'generate',
      label: 'Generate',
      icon: '⚡',
      color: 'var(--color-generate)',
      desc: 'Write code for me'
    },
    {
      id: 'explain',
      label: 'Explain',
      icon: '📖',
      color: 'var(--color-explain)',
      desc: 'Understand code'
    }
  ]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 16px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      overflowX: 'auto'
    }}>
      {modes.map(mode => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          title={mode.desc}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: currentMode === mode.id
              ? `1px solid ${mode.color}`
              : '1px solid var(--border)',
            background: currentMode === mode.id
              ? `${mode.color}22`
              : 'transparent',
            color: currentMode === mode.id
              ? mode.color
              : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: currentMode === mode.id ? 600 : 400,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            if (currentMode !== mode.id) {
              e.currentTarget.style.borderColor = mode.color
              e.currentTarget.style.color = mode.color
            }
          }}
          onMouseLeave={e => {
            if (currentMode !== mode.id) {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }
          }}
        >
          <span>{mode.icon}</span>
          <span>{mode.label}</span>
        </button>
      ))}
    </div>
  )
}