import React, { useState, useEffect, useCallback } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import LoginScreen from './components/LoginScreen.jsx'
import Header from './components/Header.jsx'
import Breadcrumb from './components/Breadcrumb.jsx'
import Toolbar from './components/Toolbar.jsx'
import StatsBar from './components/StatsBar.jsx'
import TableHeader from './components/TableHeader.jsx'
import FileRow from './components/FileRow.jsx'
import Modal, { ModalInput, ModalBtn } from './components/Modal.jsx'
import { api, setApiKey } from './utils/api.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'

function sortItems(items, sort) {
  if (!sort) return items

  const dirs = items.filter(i => i.type === 'directory' || i.isDirectory)
  const files = items.filter(i => i.type !== 'directory' && !i.isDirectory)

  function cmp(a, b) {
    let av, bv
    switch (sort.key) {
      case 'name':
        av = (a.name || '').toLowerCase()
        bv = (b.name || '').toLowerCase()
        break
      case 'size':
        av = a.size || 0
        bv = b.size || 0
        break
      case 'date':
        av = new Date(a.createdAt || a.uploadedAt || 0).getTime()
        bv = new Date(b.createdAt || b.uploadedAt || 0).getTime()
        break
      case 'expiry':
        av = new Date(a.expiresAt || a.expiry || '2099').getTime()
        bv = new Date(b.expiresAt || b.expiry || '2099').getTime()
        break
      default: return 0
    }
    if (av < bv) return sort.dir === 'asc' ? -1 : 1
    if (av > bv) return sort.dir === 'asc' ? 1 : -1
    return 0
  }

  return [...dirs.sort(cmp), ...files.sort(cmp)]
}

export default function App() {
  const [apiKey, setStoredApiKey] = useLocalStorage('bh_api_key', '')
  const [account, setAccount] = useLocalStorage('bh_account', null)
  const [items, setItems] = useState([])
  const [path, setPath] = useState([]) // [{id, name}]
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' })

  // Modals
  const [modal, setModal] = useState(null) // {type, item}
  const [modalInput, setModalInput] = useState('')
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState('')

  function handleLogin(key, acc) {
    setStoredApiKey(key)
    setApiKey(key)
    setAccount(acc)
  }

  function handleLogout() {
    setStoredApiKey('')
    setAccount(null)
    setItems([])
    setPath([])
  }

  // Set api key on mount if stored
  useEffect(() => {
    if (apiKey) setApiKey(apiKey)
  }, [apiKey])

  const loadDir = useCallback(async (dirId) => {
    setLoading(true)
    setError('')
    try {
      const data = dirId
        ? await api.getDir(dirId)
        : await api.getRootDir()
      // Normalize: may be array or {items:[]}
      const list = Array.isArray(data) ? data : (data?.items || data?.files || data?.contents || [])
      setItems(list)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load root when logged in
  useEffect(() => {
    if (apiKey && account) loadDir(null)
  }, [apiKey, account, loadDir])

  function handleNavigate(item) {
    const newPath = [...path, { id: item.id, name: item.name }]
    setPath(newPath)
    loadDir(item.id)
  }

  function handleBreadcrumb(index) {
    if (index === -1) {
      setPath([])
      loadDir(null)
    } else {
      const newPath = path.slice(0, index + 1)
      setPath(newPath)
      loadDir(newPath[newPath.length - 1].id)
    }
  }

  function handleSort(key) {
    setSort(prev =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    )
  }

  // ---- Modal helpers ----
  function openModal(type, item = null) {
    setModal({ type, item })
    setModalInput(type === 'rename' ? (item?.name || '') : '')
    setModalError('')
  }
  function closeModal() {
    if (modalLoading) return
    setModal(null)
    setModalInput('')
    setModalError('')
  }

  async function handleRename() {
    if (!modalInput.trim()) return
    setModalLoading(true)
    setModalError('')
    try {
      const isDir = modal.item.type === 'directory' || modal.item.isDirectory
      if (isDir) await api.renameDir(modal.item.id, modalInput.trim())
      else await api.renameFile(modal.item.id, modalInput.trim())
      await loadDir(path.length > 0 ? path[path.length - 1].id : null)
      closeModal()
    } catch (e) {
      setModalError(e.message)
    } finally {
      setModalLoading(false)
    }
  }

  async function handleDelete() {
    setModalLoading(true)
    setModalError('')
    try {
      const isDir = modal.item.type === 'directory' || modal.item.isDirectory
      if (isDir) await api.deleteDir(modal.item.id)
      else await api.deleteFile(modal.item.id)
      await loadDir(path.length > 0 ? path[path.length - 1].id : null)
      closeModal()
    } catch (e) {
      setModalError(e.message)
    } finally {
      setModalLoading(false)
    }
  }

  async function handleNewFolder() {
    if (!modalInput.trim()) return
    setModalLoading(true)
    setModalError('')
    try {
      const parentId = path.length > 0 ? path[path.length - 1].id : null
      // Need parent dir id — get root first if needed
      let pid = parentId
      if (!pid) {
        const root = await api.getRootDir()
        pid = root?.id || root?.directoryId
      }
      await api.createDir(pid, modalInput.trim())
      await loadDir(parentId)
      closeModal()
    } catch (e) {
      setModalError(e.message)
    } finally {
      setModalLoading(false)
    }
  }

  async function handleAddNote() {
    setModalLoading(true)
    setModalError('')
    try {
      await api.addNote(modal.item.id, modalInput)
      await loadDir(path.length > 0 ? path[path.length - 1].id : null)
      closeModal()
    } catch (e) {
      setModalError(e.message)
    } finally {
      setModalLoading(false)
    }
  }

  async function handleMove() {
    if (!modalInput.trim()) return
    setModalLoading(true)
    setModalError('')
    try {
      const isDir = modal.item.type === 'directory' || modal.item.isDirectory
      if (isDir) await api.moveDir(modal.item.id, modalInput.trim())
      else await api.moveFile(modal.item.id, modalInput.trim())
      await loadDir(path.length > 0 ? path[path.length - 1].id : null)
      closeModal()
    } catch (e) {
      setModalError(e.message)
    } finally {
      setModalLoading(false)
    }
  }

  // Filter + sort
  const filtered = sortItems(
    search
      ? items.filter(i => i.name?.toLowerCase().includes(search.toLowerCase()))
      : items,
    sort
  )

  if (!apiKey || !account) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header account={account} onLogout={handleLogout} />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <Breadcrumb path={path} onNavigate={handleBreadcrumb} />
        <Toolbar
          search={search}
          onSearch={setSearch}
          onNewFolder={() => openModal('newFolder')}
          onRefresh={() => loadDir(path.length > 0 ? path[path.length - 1].id : null)}
          loading={loading}
        />
        <StatsBar items={items} />
        <TableHeader sort={sort} onSort={handleSort} />

        {/* File list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading && items.length === 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '60px',
              color: 'var(--text-dim)',
            }}>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)' }}>Carregando...</span>
            </div>
          )}

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '24px',
              color: 'var(--red)',
              background: 'var(--red-dim)',
              margin: '16px 24px',
              borderRadius: 'var(--radius)',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
            }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: 'var(--text-dim)',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
            }}>
              {search ? 'Nenhum resultado.' : 'Pasta vazia.'}
            </div>
          )}

          {filtered.map(item => (
            <FileRow
              key={item.id}
              item={item}
              apiKey={apiKey}
              onNavigate={handleNavigate}
              onRename={item => openModal('rename', item)}
              onDelete={item => openModal('delete', item)}
              onAddNote={item => { setModalInput(item.note || ''); openModal('note', item) }}
              onMove={item => openModal('move', item)}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      {modal?.type === 'rename' && (
        <Modal title={`Renomear "${modal.item.name}"`} onClose={closeModal}>
          <ModalInput label="Novo nome" value={modalInput} onChange={setModalInput} autoFocus />
          {modalError && <div style={{ color: 'var(--red)', fontSize: '12px', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>{modalError}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <ModalBtn label="Cancelar" onClick={closeModal} secondary />
            <ModalBtn label={modalLoading ? 'Salvando...' : 'Salvar'} onClick={handleRename} disabled={modalLoading || !modalInput.trim()} />
          </div>
        </Modal>
      )}

      {modal?.type === 'delete' && (
        <Modal title={`Deletar "${modal.item.name}"`} onClose={closeModal} danger>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Esta ação é permanente e não pode ser desfeita.
          </p>
          {modalError && <div style={{ color: 'var(--red)', fontSize: '12px', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>{modalError}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <ModalBtn label="Cancelar" onClick={closeModal} secondary />
            <ModalBtn label={modalLoading ? 'Deletando...' : 'Deletar'} onClick={handleDelete} danger disabled={modalLoading} />
          </div>
        </Modal>
      )}

      {modal?.type === 'newFolder' && (
        <Modal title="Nova Pasta" onClose={closeModal}>
          <ModalInput label="Nome" value={modalInput} onChange={setModalInput} placeholder="Nome da pasta..." autoFocus />
          {modalError && <div style={{ color: 'var(--red)', fontSize: '12px', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>{modalError}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <ModalBtn label="Cancelar" onClick={closeModal} secondary />
            <ModalBtn label={modalLoading ? 'Criando...' : 'Criar'} onClick={handleNewFolder} disabled={modalLoading || !modalInput.trim()} />
          </div>
        </Modal>
      )}

      {modal?.type === 'note' && (
        <Modal title={`Nota — "${modal.item.name}"`} onClose={closeModal}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block', fontSize: '11px', color: 'var(--text-muted)',
              marginBottom: '6px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>Texto da nota</label>
            <textarea
              value={modalInput}
              onChange={e => setModalInput(e.target.value)}
              autoFocus
              rows={3}
              maxLength={500}
              style={{
                width: '100%', background: 'var(--bg)', border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)', padding: '9px 11px', color: 'var(--text)',
                fontFamily: 'var(--font-mono)', fontSize: '13px', outline: 'none', resize: 'vertical',
              }}
            />
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              {modalInput.length}/500
            </div>
          </div>
          {modalError && <div style={{ color: 'var(--red)', fontSize: '12px', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>{modalError}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <ModalBtn label="Cancelar" onClick={closeModal} secondary />
            <ModalBtn label={modalLoading ? 'Salvando...' : 'Salvar'} onClick={handleAddNote} disabled={modalLoading} />
          </div>
        </Modal>
      )}

      {modal?.type === 'move' && (
        <Modal title={`Mover "${modal.item.name}"`} onClose={closeModal}>
          <ModalInput label="ID da pasta destino" value={modalInput} onChange={setModalInput} placeholder="ex: abc123" autoFocus />
          <p style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '12px', marginTop: '-4px' }}>
            Insira o ID da pasta de destino (visível na URL da API).
          </p>
          {modalError && <div style={{ color: 'var(--red)', fontSize: '12px', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>{modalError}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <ModalBtn label="Cancelar" onClick={closeModal} secondary />
            <ModalBtn label={modalLoading ? 'Movendo...' : 'Mover'} onClick={handleMove} disabled={modalLoading || !modalInput.trim()} />
          </div>
        </Modal>
      )}
    </div>
  )
}
