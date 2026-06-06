import React from 'react'
import { Zap, LogOut, User, HardDrive } from 'lucide-react'
import { formatBytes } from '../utils/format.js'

export default function Header({ account, onLogout }) {
  const used = account?.storageUsed ?? 0
  const total = account?.storageLimit ?? 0
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      height: '52px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Left: logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Zap size={15} style={{ color: 'var(--text-muted)' }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          letterSpacing: '0.1em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
        }}>
          buzzheavier
        </span>
        <span style={{
          fontSize: '11px',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
          marginLeft: '4px',
        }}>
          / manager
        </span>
      </div>

      {/* Right: account info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Storage bar */}
        {total > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HardDrive size={13} style={{ color: 'var(--text-dim)' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {formatBytes(used)}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>/</span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                  {formatBytes(total)}
                </span>
              </div>
              <div style={{
                width: '100px',
                height: '2px',
                background: 'var(--border-light)',
                borderRadius: '1px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: pct > 85 ? 'var(--red)' : pct > 60 ? 'var(--yellow)' : 'var(--green)',
                  borderRadius: '1px',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          </div>
        )}

        {/* Account name */}
        {account?.username && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={13} style={{ color: 'var(--text-dim)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {account.username}
            </span>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          title="Sair"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontFamily: 'var(--font-sans)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--bg-hover)'
            e.currentTarget.style.color = 'var(--text)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-muted)'
          }}
        >
          <LogOut size={12} />
          Sair
        </button>
      </div>
    </header>
  )
}
