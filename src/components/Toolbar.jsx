import React from 'react'
import { Search, FolderPlus, RefreshCw, X } from 'lucide-react'

export default function Toolbar({ search, onSearch, onNewFolder, onRefresh, loading }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 24px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
    }}>
      {/* Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'var(--bg-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '6px 10px',
        flex: 1,
        maxWidth: '320px',
      }}>
        <Search size={13} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Filtrar..."
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
            flex: 1,
            minWidth: 0,
          }}
        />
        {search && (
          <button
            onClick={() => onSearch('')}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-dim)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <X size={12} />
          </button>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Actions */}
      <ToolBtn icon={<FolderPlus size={13} />} label="Nova Pasta" onClick={onNewFolder} />
      <ToolBtn
        icon={<RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />}
        label="Atualizar"
        onClick={onRefresh}
        disabled={loading}
      />
    </div>
  )
}

function ToolBtn({ icon, label, onClick, disabled }) {
  const [hov, setHov] = React.useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        background: hov ? 'var(--bg-hover)' : 'var(--bg-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        color: hov ? 'var(--text)' : 'var(--text-muted)',
        fontSize: '12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s',
        fontFamily: 'var(--font-sans)',
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      {label}
    </button>
  )
}
