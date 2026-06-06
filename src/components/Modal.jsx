import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function Modal({ title, onClose, children, danger }) {
  const ref = useRef(null)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.15s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={ref}
        style={{
          background: 'var(--bg-2)',
          border: `1px solid ${danger ? 'var(--red-dim)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          width: '100%',
          maxWidth: '420px',
          padding: '20px',
          margin: '16px',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}>
          <span style={{ fontSize: '13px', fontWeight: '500', color: danger ? 'var(--red)' : 'var(--text)' }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function ModalInput({ label, value, onChange, placeholder, autoFocus }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '11px',
          color: 'var(--text-muted)',
          marginBottom: '6px',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          width: '100%',
          background: 'var(--bg)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          padding: '9px 11px',
          color: 'var(--text)',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          outline: 'none',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--text-dim)'}
        onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
      />
    </div>
  )
}

export function ModalBtn({ label, onClick, danger, secondary, disabled }) {
  const [hov, setHov] = React.useState(false)

  const bg = secondary
    ? (hov ? 'var(--bg-hover)' : 'transparent')
    : danger
      ? (hov ? '#ef4444' : 'var(--red-dim)')
      : (hov ? '#e5e5e5' : 'var(--text)')

  const color = secondary
    ? 'var(--text-muted)'
    : danger
      ? (hov ? '#fff' : 'var(--red)')
      : 'var(--bg)'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '8px 14px',
        borderRadius: 'var(--radius-sm)',
        background: bg,
        color,
        fontSize: '13px',
        fontWeight: '500',
        border: secondary ? '1px solid var(--border)' : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {label}
    </button>
  )
}
