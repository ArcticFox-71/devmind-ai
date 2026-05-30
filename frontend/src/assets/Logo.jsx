export default function Logo({ size = 32, showText = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1a2e"/>
            <stop offset="100%" stopColor="#0a0a1a"/>
          </radialGradient>
          <linearGradient id="leftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f8ef7" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.25"/>
          </linearGradient>
          <linearGradient id="rightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#4f8ef7" stopOpacity="0.25"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle cx="32" cy="32" r="30" fill="url(#bgGrad)"/>
        <circle cx="32" cy="32" r="30" fill="none" stroke="#4f8ef733" strokeWidth="1"/>

        {/* Brain left hemisphere */}
        <path
          d="M32 13 C23 13 15 19 14 28 C13 34 15 38 18 41 C20 43 21 46 21 49 L32 49 L32 13Z"
          fill="url(#leftGrad)"
        />

        {/* Brain right hemisphere */}
        <path
          d="M32 13 C41 13 49 19 50 28 C51 34 49 38 46 41 C44 43 43 46 43 49 L32 49 L32 13Z"
          fill="url(#rightGrad)"
        />

        {/* Center divide */}
        <line x1="32" y1="13" x2="32" y2="49" stroke="#0a0a1a" strokeWidth="1.5"/>

        {/* Base */}
        <rect x="23" y="48" width="18" height="3" rx="1.5" fill="#4f8ef766"/>

        {/* Circuit nodes left */}
        <circle cx="20" cy="23" r="2.5" fill="#4f8ef7" filter="url(#glow)"/>
        <circle cx="17" cy="33" r="2" fill="#7c3aed" filter="url(#glow)"/>
        <circle cx="22" cy="43" r="2" fill="#4f8ef7" filter="url(#glow)"/>

        {/* Circuit lines left */}
        <polyline points="20,23 14,23 14,33 17,33" stroke="#4f8ef7" strokeWidth="1" fill="none" opacity="0.6"/>
        <polyline points="17,33 14,33 14,43 22,43" stroke="#7c3aed" strokeWidth="1" fill="none" opacity="0.6"/>

        {/* Circuit nodes right */}
        <circle cx="44" cy="23" r="2.5" fill="#4f8ef7" filter="url(#glow)"/>
        <circle cx="47" cy="33" r="2" fill="#7c3aed" filter="url(#glow)"/>
        <circle cx="42" cy="43" r="2" fill="#4f8ef7" filter="url(#glow)"/>

        {/* Circuit lines right */}
        <polyline points="44,23 50,23 50,33 47,33" stroke="#4f8ef7" strokeWidth="1" fill="none" opacity="0.6"/>
        <polyline points="47,33 50,33 50,43 42,43" stroke="#7c3aed" strokeWidth="1" fill="none" opacity="0.6"/>

        {/* Top node */}
        <circle cx="32" cy="13" r="3" fill="#4f8ef7" filter="url(#glow)"/>

        {/* Code symbol */}
        <text x="25" y="35" fontSize="11" fill="white" fontFamily="monospace" fontWeight="bold" opacity="0.7">&lt;/&gt;</text>
      </svg>

      {showText && (
        <div>
          <div style={{
            fontWeight: 800,
            fontSize: size * 0.45,
            background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
            lineHeight: 1.1
          }}>DevMind</div>
          <div style={{
            fontSize: size * 0.28,
            color: 'var(--text-muted)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: 500
          }}>AI</div>
        </div>
      )}
    </div>
  )
}