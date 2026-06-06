import React from 'react'
import { Folder, File, HardDrive, Clock } from 'lucide-react'
import { formatBytes } from '../utils/format.js'

export default function StatsBar({ items }) {
  const files = items.filter(i => i.type !== 'directory' && !i.isDirectory)
  const dirs = items.filter(i => i.type === 'directory' || i.isDirectory)
  const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0)

  const now = Date.now()
  const expiringSoon = files.filter(f => {
    if (!f.expiresAt && !f.expiry) return false
    const d = new Date(f.expiresAt || f.expiry)
    return (d - now) < 7 * 24 * 60 * 60 * 1000 && d > now
  })

  const stats = [
    { icon: <Folder size={12} />, label: 'Pastas', value: dirs.length },
    { icon: <File size={12} />, label: 'Arquivos', value: files.length },
    { icon: <HardDrive size={12} />, label: 'Tamanho', value: formatBytes(totalSize) },
    expiringSoon.length > 0 && {
      icon: <Clock size={12} />,
      label: 'Expirando em 7d',
      value: expiringSoon.length,
      warn: true,
    },
  ].filter(Boolean)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0',
      padding: '0 24px',
      height: '36px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-2)',
    }}>
      {stats.map((s, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div style={{ width: '1px', height: '16px', background: 'var(--border)', margin: '0 16px' }} />}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{ color: s.warn ? 'var(--yellow)' : 'var(--text-dim)' }}>{s.icon}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              {s.label}:
            </span>
            <span style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: s.warn ? 'var(--yellow)' : 'var(--text-muted)',
              fontWeight: '500',
            }}>
              {s.value}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
