// Usando caminho relativo para o proxy do Vite funcionar (evita CORS)
const BASE_URL = '/api'

let _apiKey = ''

export function setApiKey(key) {
  _apiKey = key
}

export function getApiKey() {
  return _apiKey
}

function headers() {
  return {
    'Authorization': `Bearer ${_apiKey}`,
    'Content-Type': 'application/json',
  }
}

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${res.status}: ${text}`)
  }

  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export const api = {
  getAccount: () => request('GET', '/account'),
  getLocations: () => request('GET', '/locations'),

  // File system
  getRootDir: () => request('GET', '/fs'),
  getDir: (id) => request('GET', `/fs/${id}`),
  createDir: (parentId, name) => request('POST', `/fs/${parentId}`, { name }),
  renameDir: (id, name) => request('PATCH', `/fs/${id}`, { name }),
  moveDir: (id, parentId) => request('PUT', `/fs/${id}`, { parentId }),
  deleteDir: (id) => request('DELETE', `/fs/${id}`),

  renameFile: (id, name) => request('PATCH', `/fs/${id}`, { name }),
  moveFile: (id, parentId) => request('PUT', `/fs/${id}`, { parentId }),
  addNote: (id, note) => request('PUT', `/fs/${id}`, { note }),
  deleteFile: (id) => request('DELETE', `/fs/${id}`),
}
