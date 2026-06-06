export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatDateFull(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function timeUntilExpiry(dateStr) {
  if (!dateStr) return null
  const expiry = new Date(dateStr)
  const now = new Date()
  const diff = expiry - now

  if (diff <= 0) return { label: 'Expirado', status: 'expired' }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  let status = 'ok'
  if (days < 3) status = 'critical'
  else if (days < 7) status = 'warning'

  if (days > 0) return { label: `${days}d ${hours}h`, status }
  return { label: `${hours}h`, status }
}

export function getFileIcon(name) {
  if (!name) return 'file'
  const ext = name.split('.').pop()?.toLowerCase()
  const map = {
    mp4: 'video', mkv: 'video', avi: 'video', mov: 'video', webm: 'video',
    mp3: 'audio', flac: 'audio', wav: 'audio', ogg: 'audio',
    jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', svg: 'image',
    pdf: 'pdf',
    zip: 'archive', rar: 'archive', '7z': 'archive', tar: 'archive', gz: 'archive',
    txt: 'text', md: 'text', log: 'text',
    js: 'code', ts: 'code', jsx: 'code', tsx: 'code', py: 'code', html: 'code', css: 'code', json: 'code',
    exe: 'binary', bin: 'binary', iso: 'binary',
  }
  return map[ext] || 'file'
}
