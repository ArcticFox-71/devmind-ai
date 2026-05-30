import { useState, useRef } from 'react'

export default function InputBar({ onSend, onImageSend, isLoading, mode, language = 'Auto', onLanguageChange }) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)
  const textareaRef = useRef(null)

  const placeholders = {
    chat: 'Ask anything about code...',
    debug: 'Paste your buggy code or error message...',
    generate: 'Describe the code you want to generate...',
    explain: 'Paste code you want explained...'
  }

  const modeColors = {
    chat: 'var(--color-chat)',
    debug: 'var(--color-debug)',
    generate: 'var(--color-generate)',
    explain: 'var(--color-explain)'
  }

  const accentColor = modeColors[mode] || 'var(--accent)'

  const handleSend = () => {
    if (isLoading) return
    if (imageFile) {
      const question = message.trim() || 'Analyze this image'
      onImageSend(imageFile, question, mode, language)
      setMessage('')
      setImageFile(null)
      setImagePreview(null)
      return
    }
    if (!message.trim()) return
    onSend(message.trim(), language)
    setMessage('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input not supported! Please use Chrome or Edge.')
      return
    }
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onstart = () => setIsRecording(true)
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setMessage(prev => prev ? prev + ' ' + transcript : transcript)
      setIsRecording(false)
    }
    recognition.onend = () => setIsRecording(false)
    recognition.onerror = () => setIsRecording(false)
    recognitionRef.current = recognition
    recognition.start()
  }

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageFile(file)
  }

  const handlePaste = (e) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        handleImageFile(file)
        break
      }
    }
  }

  const safeLang = language || 'Auto'

  return (
    <div
      style={{
        padding: '10px 16px 14px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)'
      }}
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Image Preview */}
      {imagePreview && (
        <div style={{
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '10px',
          background: 'var(--bg-tertiary)',
          borderRadius: '10px',
          border: '1px solid var(--border)'
        }}>
          <img
            src={imagePreview}
            alt="preview"
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              📎 Image attached — add a description below or just send
            </div>
            <div style={{ fontSize: '11px', color: accentColor }}>
              {imageFile?.name}
            </div>
          </div>
          <button
            onClick={removeImage}
            style={{
              background: '#f74f4f22',
              border: '1px solid #f74f4f55',
              borderRadius: '6px',
              color: '#f74f4f',
              cursor: 'pointer',
              fontSize: '11px',
              padding: '3px 8px'
            }}
          >✕ Remove</button>
        </div>
      )}

      {/* Drag Over Hint */}
      {dragOver && (
        <div style={{
          textAlign: 'center',
          color: accentColor,
          fontSize: '12px',
          marginBottom: '8px',
          padding: '6px',
          border: `1px dashed ${accentColor}`,
          borderRadius: '8px',
          background: `${accentColor}11`
        }}>
          📎 Drop image here to analyze!
        </div>
      )}

      {/* Input Box */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        background: 'var(--bg-tertiary)',
        border: `1px solid ${dragOver ? accentColor : 'var(--border)'}`,
        borderRadius: '14px',
        padding: '8px 8px 8px 14px',
        transition: 'border-color 0.2s'
      }}>
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Upload image or screenshot"
          style={{
            background: imageFile ? `${accentColor}22` : 'none',
            border: imageFile ? `1px solid ${accentColor}` : 'none',
            borderRadius: '6px',
            color: imageFile ? accentColor : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '4px 6px',
            transition: 'all 0.2s',
            lineHeight: 1,
            flexShrink: 0
          }}
          onMouseEnter={e => { if (!imageFile) e.currentTarget.style.color = accentColor }}
          onMouseLeave={e => { if (!imageFile) e.currentTarget.style.color = 'var(--text-muted)' }}
        >📎</button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => handleImageFile(e.target.files[0])}
        />

        <textarea
          ref={textareaRef}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={imageFile ? 'Describe what you want to know about this image...' : placeholders[mode]}
          rows={1}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '13px',
            resize: 'none',
            fontFamily: 'inherit',
            lineHeight: '1.6',
            maxHeight: '140px',
            overflowY: 'auto',
            paddingTop: '2px'
          }}
          onInput={e => {
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
          }}
        />

        <button
          onClick={handleVoice}
          title={isRecording ? 'Stop recording' : 'Voice input'}
          className={isRecording ? 'recording' : ''}
          style={{
            background: isRecording ? '#f74f4f22' : 'none',
            border: isRecording ? '1px solid #f74f4f' : 'none',
            borderRadius: '8px',
            color: isRecording ? '#f74f4f' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '5px 7px',
            transition: 'all 0.2s',
            lineHeight: 1,
            flexShrink: 0
          }}
          onMouseEnter={e => { if (!isRecording) e.currentTarget.style.color = '#f74f4f' }}
          onMouseLeave={e => { if (!isRecording) e.currentTarget.style.color = 'var(--text-muted)' }}
        >🎤</button>

        <button
          onClick={handleSend}
          disabled={(!message.trim() && !imageFile) || isLoading}
          style={{
            background: (message.trim() || imageFile) && !isLoading
              ? `linear-gradient(135deg, ${accentColor}, #7c3aed)`
              : 'var(--bg-card)',
            border: 'none',
            borderRadius: '10px',
            color: (message.trim() || imageFile) && !isLoading ? 'white' : 'var(--text-muted)',
            cursor: (message.trim() || imageFile) && !isLoading ? 'pointer' : 'not-allowed',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px',
            transition: 'all 0.2s',
            flexShrink: 0
          }}
        >
          {isLoading ? (
            <div style={{
              width: '14px', height: '14px',
              border: '2px solid var(--text-muted)',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}/>
          ) : '➤'}
        </button>
      </div>

      {/* Language Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginTop: '8px',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Language:</span>
        {['Auto','Python','JavaScript','TypeScript','Java','C','CPP','C#','Rust','Go','Ruby','PHP','Swift','Kotlin','Dart','R','MATLAB','Bash','SQL','HTML','CSS','JSX','TSX'].map(lang => (
          <button
            key={lang}
            onClick={() => {
              if (lang === 'Auto') {
                onLanguageChange('Auto')
              } else if (safeLang !== 'Auto' && safeLang.split('+').includes(lang)) {
                const langs = safeLang.split('+').filter(l => l !== lang)
                onLanguageChange(langs.length ? langs.join('+') : 'Auto')
              } else {
                const current = safeLang === 'Auto' ? [] : safeLang.split('+')
                onLanguageChange([...current, lang].join('+'))
              }
            }}
            style={{
              padding: '2px 8px',
              borderRadius: '20px',
              border: lang === 'Auto' && safeLang === 'Auto'
                ? '1px solid var(--color-generate)'
                : safeLang !== 'Auto' && safeLang.split('+').includes(lang)
                  ? `1px solid ${accentColor}`
                  : '1px solid var(--border-light)',
              background: lang === 'Auto' && safeLang === 'Auto'
                ? '#4ff7a022'
                : safeLang !== 'Auto' && safeLang.split('+').includes(lang)
                  ? `${accentColor}22`
                  : 'transparent',
              color: lang === 'Auto' && safeLang === 'Auto'
                ? 'var(--color-generate)'
                : safeLang !== 'Auto' && safeLang.split('+').includes(lang)
                  ? accentColor
                  : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '10px',
              fontFamily: 'monospace',
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => {
              if (!safeLang.split('+').includes(lang)) {
                e.currentTarget.style.borderColor = accentColor
                e.currentTarget.style.color = accentColor
              }
            }}
            onMouseLeave={e => {
              if (!safeLang.split('+').includes(lang)) {
                e.currentTarget.style.borderColor = 'var(--border-light)'
                e.currentTarget.style.color = 'var(--text-muted)'
              }
            }}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Hint text */}
      <div style={{
        textAlign: 'center',
        fontSize: '10px',
        color: 'var(--text-muted)',
        marginTop: '6px',
        display: 'flex',
        justifyContent: 'center',
        gap: '12px'
      }}>
        <span>↵ Send</span>
        <span>⇧↵ New line</span>
        <span>📎 Image/Screenshot</span>
        <span>🎤 Voice</span>
        <span>⌘V Paste image</span>
      </div>
    </div>
  )
}