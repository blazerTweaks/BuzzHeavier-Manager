import React from 'react'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumb({ path, onNavigate }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '0 24px',
      height: '40px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
      overflowX: 'auto',
      flexShrink: 0,
    }}>
      <button
        onClick={() => onNavigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          color: path.length === 0 ? 'var(--text)' : 'var(--text-muted)',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          padding: '3px 6px',
          borderRadius: 'var(--radius-sm)',
          transition: 'color 0.15s, background 0.15s',
          whiteSpace: 'nowrap',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          if (path.length > 0) {
            e.currentTarget.style.color = 'var(--text)'
            e.currentTarget.style.background = 'var(--bg-hover)'
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = path.length === 0 ? 'var(--text)' : 'var(--text-muted)'
          e.currentTarget.style.background = 'none'
        }}
      >
        <Home size={11} />
        root
      </button>

      {path.map((segment, i) => (
        <React.Fragment key={segment.id}>
          <ChevronRight size={11} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
          <button
            onClick={() => onNavigate(i)}
            style={{
              color: i === path.length - 1 ? 'var(--text)' : 'var(--text-muted)',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              padding: '3px 6px',
              borderRadius: 'var(--radius-sm)',
              transition: 'color 0.15s, background 0.15s',
              whiteSpace: 'nowrap',
              background: 'none',
              border: 'none',
              cursor: i < path.length - 1 ? 'pointer' : 'default',
            }}
            onMouseEnter={e => {
              if (i < path.length - 1) {
                e.currentTarget.style.color = 'var(--text)'
                e.currentTarget.style.background = 'var(--bg-hover)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = i === path.length - 1 ? 'var(--text)' : 'var(--text-muted)'
              e.currentTarget.style.background = 'none'
            }}
          >
            {segment.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  )
}
