export default {
  async fetch(request, env) {
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
      headers.set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
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
      headers.set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
      const resp = await fetch(`https://w.buzzheavier.com${path.replace('/upload', '')}${url.search}`, {
        method: request.method,
        headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
      })
      return resp
    }

    try {
      const response = await env.ASSETS.fetch(request)
      if (response.status === 404) {
        return env.ASSETS.fetch(new Request(new URL('/index.html', url), request))
      }
      return response
    } catch {
      return new Response('Worker active but ASSETS unavailable', { status: 200 })
    }
  },
}
