export async function onRequest(context) {
  const { request, next } = context
  const url = new URL(request.url)

  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/upload')) {
    const isUpload = url.pathname.startsWith('/upload')
    const targetHost = isUpload ? 'w.buzzheavier.com' : 'buzzheavier.com'
    const targetPath = isUpload ? url.pathname.replace('/upload', '') : url.pathname

    const headers = new Headers()
    const auth = request.headers.get('authorization')
    if (auth) headers.set('authorization', auth)
    headers.set('host', targetHost)
    headers.set('user-agent', 'Mozilla/5.0')
    if (isUpload) {
      const ct = request.headers.get('content-type')
      if (ct) headers.set('content-type', ct)
    } else {
      headers.set('accept', 'application/json')
    }

    return fetch(`https://${targetHost}${targetPath}${url.search}`, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
    })
  }

  return next()
}
