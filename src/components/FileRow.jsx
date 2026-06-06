import React, { useState } from 'react'
import {
  Folder, FolderOpen, File, Film, Music, Image, FileText,
  Archive, Code, Binary, FileType2,
  ExternalLink, Pencil, Trash2, MoveRight, StickyNote, Copy, Check
} from 'lucide-react'
import { formatBytes, formatDate, timeUntilExpiry, getFileIcon } from '../utils/format.js'

function FileTypeIcon({ name, isDir, size = 15 }) {
  if (isDir) return <Folder size={size} style={{ color: '#60a5fa' }} />
  const type = getFileIcon(name)
  const props = { size, style: {} }
  switch (type) {
    case 'video': return <Film {...props} style={{ color: '#c084fc' }} />
    case 'audio': return <Music {...props} style={{ color: '#fb923c' }} />
    case 'image': return <Image {...props} style={{ color: '#34d399' }} />
    case 'pdf': return <FileType2 {...props} style={{ color: '#f87171' }} />
    case 'archive': return <Archive {...props} style={{ color: '#fbbf24' }} />
    case 'code': return <Code {...props} style={{ color: '#67e8f9' }} />
    case 'text': return <FileText {...props} style={{ color: '#a3a3a3' }} />
    case 'binary': return <Binary {...props} style={{ color: '#a78bfa' }} />
    default: return <File {...props} style={{ color: '#666' }} />
  }
}

function ExpiryBadge({ expiry }) {
  if (!expiry) return <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>—</span>
  const info = timeUntilExpiry(expiry)
  if (!info) return null

  const colors = {
    ok: { color: 'var(--green)', bg: 'var(--green-dim)' },
    warning: { color: 'var(--yellow)', bg: 'var(--yellow-dim)' },
    critical: { color: 'var(--red)', bg: 'var(--red-dim)' },
    expired: { color: 'var(--text-dim)', bg: 'transparent' },
  }
  const c = colors[info.status] || colors.ok

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      background: c.bg,
      color: c.color,
      fontSize: '11px',
      padding: '2px 7px',
      borderRadius: '3px',
      fontFamily: 'var(--font-mono)',
      whiteSpace: 'nowrap',
    }}>
      {info.label}
    </span>
  )
}

export default function FileRow({ item, onNavigate, onRename, onDelete, onAddNote, onMove, apiKey }) {
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  const isDir = item.type === 'directory' || item.isDirectory

  const fileUrl = !isDir && item.id
    ? `https://buzzheavier.com/${item.id}`
    : null

  function handleCopyLink() {
    if (!fileUrl) return
    navigator.clipboard.writeText(fileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const cols = {
    name: 'minmax(200px, 1fr)',
    size: '90px',
    date: '110px',
    expiry: '100px',
    actions: '120px',
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: `${cols.name} ${cols.size} ${cols.date} ${cols.expiry} ${cols.actions}`,
        alignItems: 'center',
        padding: '0 24px',
        height: '40px',
        borderBottom: '1px solid var(--border)',
        background: hovered ? 'var(--bg-hover)' : 'transparent',
        transition: 'background 0.1s',
        animation: 'fadeIn 0.15s ease',
        cursor: isDir ? 'pointer' : 'default',
      }}
      onClick={() => isDir && onNavigate(item)}
    >
      {/* Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', overflow: 'hidden' }}>
        <FileTypeIcon name={item.name} isDir={isDir} />
        <span style={{
          fontSize: '13px',
          color: 'var(--text)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.01em',
        }}>
          {item.name}
        </span>
        {item.note && (
          <StickyNote size={11} style={{ color: 'var(--text-dim)', flexShrink: 0 }} title={item.note} />
        )}
      </div>

      {/* Size */}
      <div style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
      }}>
        {isDir ? (
          <span style={{ color: 'var(--text-dim)' }}>—</span>
        ) : (
          formatBytes(item.size)
        )}
      </div>

      {/* Date */}
      <div style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
      }}>
        {formatDate(item.createdAt || item.uploadedAt)}
      </div>

      {/* Expiry */}
      <div>
        <ExpiryBadge expiry={item.expiresAt || item.expiry} />
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.15s',
          justifyContent: 'flex-end',
        }}
        onClick={e => e.stopPropagation()}
      >
        {fileUrl && (
          <>
            <ActionBtn icon={copied ? <Check size={13} /> : <Copy size={13} />} title="Copiar link" onClick={handleCopyLink} color={copied ? 'var(--green)' : undefined} />
            <ActionBtn icon={<ExternalLink size={13} />} title="Abrir" onClick={() => window.open(fileUrl, '_blank')} />
          </>
        )}
        <ActionBtn icon={<Pencil size={13} />} title="Renomear" onClick={() => onRename(item)} />
        {!isDir && <ActionBtn icon={<StickyNote size={13} />} title="Nota" onClick={() => onAddNote(item)} />}
        <ActionBtn icon={<MoveRight size={13} />} title="Mover" onClick={() => onMove(item)} />
        <ActionBtn icon={<Trash2 size={13} />} title="Deletar" onClick={() => onDelete(item)} danger />
      </div>
    </div>
  )
}

function ActionBtn({ icon, title, onClick, danger, color }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '26px',
        height: '26px',
        borderRadius: 'var(--radius-sm)',
        background: hov ? (danger ? 'var(--red-dim)' : 'var(--bg-3)') : 'transparent',
        color: color || (hov ? (danger ? 'var(--red)' : 'var(--text)') : 'var(--text-muted)'),
        transition: 'all 0.1s',
        border: 'none',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {icon}
    </button>
  )
}
