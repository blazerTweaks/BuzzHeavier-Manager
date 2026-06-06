import React from 'react'
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react'

const COLS = [
  { key: 'name', label: 'Nome', flex: '1' },
  { key: 'size', label: 'Tamanho', width: '90px' },
  { key: 'date', label: 'Data', width: '110px' },
  { key: 'expiry', label: 'Expira em', width: '100px' },
  { key: null, label: '', width: '120px' },
]

export default function TableHeader({ sort, onSort }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(200px, 1fr) 90px 110px 100px 120px',
      padding: '0 24px',
      height: '32px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-2)',
      position: 'sticky',
      top: '52px',
      zIndex: 50,
    }}>
      {COLS.map((col) => (
        <div
          key={col.label}
          onClick={() => col.key && onSort(col.key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: col.key ? 'pointer' : 'default',
            userSelect: 'none',
          }}
        >
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: sort?.key === col.key ? 'var(--text-muted)' : 'var(--text-dim)',
            transition: 'color 0.15s',
          }}>
            {col.label}
          </span>
          {col.key && (
            sort?.key === col.key
              ? (sort.dir === 'asc' ? <ArrowUp size={10} style={{ color: 'var(--text-muted)' }} /> : <ArrowDown size={10} style={{ color: 'var(--text-muted)' }} />)
              : <ChevronsUpDown size={10} style={{ color: 'var(--text-dim)' }} />
          )}
        </div>
      ))}
    </div>
  )
}
