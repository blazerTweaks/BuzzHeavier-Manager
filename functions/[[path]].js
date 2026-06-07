export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const path = url.pathname

  if (path === '/api/_test') {
    return new Response(JSON.stringify({ ok: true, worker: 'active' }), {
      headers: { 'content-type': 'application/json' },
    })
  }

  if (path.startsWith('/api')) {
    const headers = new Headers(request.headers)
    headers.set('host', 'buzzheavier.com')
    const resp = await fetch(`https://buzzheavier.com${path}${url.search}`, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
    })
    return resp
  }

  if (path.startsWith('/upload')) {
    const headers = new Headers(request.headers)
    headers.set('host', 'w.buzzheavier.com')
    const resp = await fetch(`https://w.buzzheavier.com${path.replace('/upload', '')}${url.search}`, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
    })
    return resp
  }

  const response = await env.ASSETS.fetch(request)
  if (response.status === 404) {
    return env.ASSETS.fetch(new Request(new URL('/index.html', url), request))
  }
  return response
}
