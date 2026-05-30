import { useState } from 'react'

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function highlight(code) {
  const keywords = new Set([
    'def','class','return','import','from','if','elif','else','for','while',
    'in','not','and','or','try','except','finally','with','as','pass','break',
    'continue','lambda','yield','async','await','const','let','var','function',
    'new','this','typeof','instanceof','export','default','extends','super',
    'null','undefined','true','false','None','True','False','print','range',
    'len','self','static','void','public','private','protected','throw','catch',
    'switch','case','do','of','from','require','module','=>','interface','type',
    'enum','implements','abstract','readonly'
  ])

  return code.split('\n').map(line => {
    // Full line comments
    const trimmed = line.trimStart()
    const indent = line.slice(0, line.length - trimmed.length)

    if (trimmed.startsWith('//')) {
  return escHtml(indent) + `<span class="hl-cmt">${escHtml(trimmed)}</span>`
}
// C/C++ preprocessor directives — NOT comments
if (trimmed.startsWith('#include') || trimmed.startsWith('#define') ||
    trimmed.startsWith('#ifndef') || trimmed.startsWith('#ifdef') ||
    trimmed.startsWith('#endif') || trimmed.startsWith('#pragma')) {
  // Split at inline comment if exists
  const commentIdx = trimmed.indexOf('//')
  if (commentIdx !== -1) {
    const directive = trimmed.slice(0, commentIdx)
    const comment = trimmed.slice(commentIdx)
    return escHtml(indent) +
      `<span class="hl-kw">${escHtml(directive)}</span>` +
      `<span class="hl-cmt">${escHtml(comment)}</span>`
  }
  return escHtml(indent) + `<span class="hl-kw">${escHtml(trimmed)}</span>`
}
// Python comments only
if (trimmed.startsWith('#') && !trimmed.startsWith('#!')) {
  return escHtml(indent) + `<span class="hl-cmt">${escHtml(trimmed)}</span>`
}

    let result = ''
    let i = 0

    while (i < line.length) {
      // Inline # Python comment
      if (line[i] === '#') {
      result += `<span class="hl-cmt">${escHtml(line.slice(i))}</span>`
      break
      }
      // Inline // comment
      if (line[i] === '/' && line[i+1] === '/') {
        result += `<span class="hl-cmt">${escHtml(line.slice(i))}</span>`
        break
      }

      // Multi-line comment start /*
      if (line[i] === '/' && line[i+1] === '*') {
        const end = line.indexOf('*/', i + 2)
        if (end !== -1) {
          result += `<span class="hl-cmt">${escHtml(line.slice(i, end + 2))}</span>`
          i = end + 2
        } else {
          result += `<span class="hl-cmt">${escHtml(line.slice(i))}</span>`
          break
        }
        continue
      }

      // JSDoc comment line starting with *
      if (trimmed.startsWith('*')) {
        return escHtml(indent) + `<span class="hl-cmt">${escHtml(trimmed)}</span>`
      }

      // Strings — double quote
      if (line[i] === '"') {
        let j = i + 1
        while (j < line.length) {
          if (line[j] === '\\') { j += 2; continue }
          if (line[j] === '"') { j++; break }
          j++
        }
        result += `<span class="hl-str">${escHtml(line.slice(i, j))}</span>`
        i = j
        continue
      }

      // Strings — single quote
      if (line[i] === "'") {
        let j = i + 1
        while (j < line.length) {
          if (line[j] === '\\') { j += 2; continue }
          if (line[j] === "'") { j++; break }
          j++
        }
        result += `<span class="hl-str">${escHtml(line.slice(i, j))}</span>`
        i = j
        continue
      }

      // Template literals
      if (line[i] === '`') {
        let j = i + 1
        while (j < line.length) {
          if (line[j] === '\\') { j += 2; continue }
          if (line[j] === '`') { j++; break }
          j++
        }
        result += `<span class="hl-str">${escHtml(line.slice(i, j))}</span>`
        i = j
        continue
      }

      // Numbers
      if (/\d/.test(line[i]) && (i === 0 || /\W/.test(line[i-1]))) {
        let j = i
        while (j < line.length && /[\d.xXa-fA-F_]/.test(line[j])) j++
        result += `<span class="hl-num">${escHtml(line.slice(i, j))}</span>`
        i = j
        continue
      }

      // Words
      if (/[a-zA-Z_$]/.test(line[i])) {
        let j = i
        while (j < line.length && /[\w$]/.test(line[j])) j++
        const word = line.slice(i, j)

        // Skip whitespace after word
        let k = j
        while (k < line.length && line[k] === ' ') k++

        if (keywords.has(word)) {
          result += `<span class="hl-kw">${escHtml(word)}</span>`
        } else if (line[j] === '(' || line[k] === '(') {
          result += `<span class="hl-fn">${escHtml(word)}</span>`
        } else if (word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) {
          // PascalCase = component/class name
          result += `<span class="hl-fn">${escHtml(word)}</span>`
        } else {
          result += escHtml(word)
        }
        i = j
        continue
      }

      // JSX tags < >
      if (line[i] === '<' && /[a-zA-Z\/!]/.test(line[i+1] || '')) {
        let j = i + 1
        while (j < line.length && line[j] !== '>') j++
        result += `<span class="hl-kw">${escHtml(line.slice(i, j+1))}</span>`
        i = j + 1
        continue
      }

      result += escHtml(line[i])
      i++
    }

    return result
  }).join('\n')
}

export default function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      borderRadius: '10px',
      border: '1px solid var(--code-border)',
      overflow: 'hidden',
      margin: '10px 0',
      background: 'var(--code-bg)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '7px 14px',
        background: 'var(--code-header-bg, var(--bg-tertiary))',
        borderBottom: '1px solid #4f8ef733'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f74f4f' }}/>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f7c44f' }}/>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ff7a0' }}/>
          </div>
          <span style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.8px'
          }}>
            {language || 'code'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          style={{
            background: copied ? '#4ff7a022' : 'var(--bg-card)',
            border: `1px solid ${copied ? '#4ff7a0' : 'var(--border)'}`,
            borderRadius: '6px',
            color: copied ? '#4ff7a0' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '11px',
            padding: '3px 10px',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {copied ? '✓ Copied!' : '⎘ Copy'}
        </button>
      </div>

      {/* Code */}
      <pre style={{
        margin: 0,
        padding: '14px 16px',
        overflowX: 'auto',
        fontSize: '13px',
        lineHeight: '1.7',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Courier New', monospace"
      }}>
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  )
}