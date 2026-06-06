import React, { useState } from 'react'
import { KeyRound, Zap } from 'lucide-react'

export default function LoginScreen({ onLogin }) {
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!key.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/account', {
        headers: { 'Authorization': `Bearer ${key.trim()}` }
      })
      if (!res.ok) throw new Error('Chave inválida')
      const data = await res.json()
      onLogin(key.trim(), data)
    } catch (err) {
      setError(err.message || 'Falha ao conectar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '24px',
      background: 'var(--bg)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '360px',
        animation: 'fadeIn 0.3s ease',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}>
            <Zap size={18} style={{ color: 'var(--text-muted)' }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}>buzzheavier</span>
          </div>
          <div style={{
            fontSize: '22px',
            fontWeight: '500',
            letterSpacing: '-0.02em',
            color: 'var(--text)',
          }}>File Manager</div>
        </div>

        {/* Form */}
        <div style={{
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '24px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}>
            <KeyRound size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Account ID (API Key)
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="Seu Account ID..."
              autoFocus
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                color: 'var(--text)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                outline: 'none',
                marginBottom: '12px',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--text-dim)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
            />

            {error && (
              <div style={{
                fontSize: '12px',
                color: 'var(--red)',
                marginBottom: '12px',
                fontFamily: 'var(--font-mono)',
              }}>
                ✕ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !key.trim()}
              style={{
                width: '100%',
                background: 'var(--text)',
                color: 'var(--bg)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '10px',
                fontWeight: '500',
                fontSize: '13px',
                cursor: loading ? 'wait' : 'pointer',
                opacity: (!key.trim() || loading) ? 0.5 : 1,
                transition: 'opacity 0.15s',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {loading ? 'Conectando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <div style={{
          marginTop: '16px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
        }}>
          Encontre seu Account ID em{' '}
          <a
            href="https://buzzheavier.com/account"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}
          >
            buzzheavier.com/account
          </a>
        </div>
      </div>
    </div>
  )
}
