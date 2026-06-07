export default {
  async fetch(request) {
    const url = new URL(request.url)
    const path = url.pathname
    const auth = request.headers.get('Authorization') || ''

    if (path.startsWith('/api')) {
      const resp = await fetch(`https://buzzheavier.com${path}${url.search}`, {
        method: request.method,
        headers: {
          Authorization: auth,
          Host: 'buzzheavier.com',
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
      })
      const cors = new Response(resp.body, resp)
      cors.headers.set('Access-Control-Allow-Origin', '*')
      cors.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
      cors.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type')
      return cors
    }

    if (path.startsWith('/upload')) {
      const ct = request.headers.get('Content-Type') || ''
      const resp = await fetch(`https://w.buzzheavier.com${path.replace('/upload', '')}${url.search}`, {
        method: request.method,
        headers: {
          Authorization: auth,
          Host: 'w.buzzheavier.com',
          'User-Agent': 'Mozilla/5.0',
          'Content-Type': ct,
        },
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
      })
      const cors = new Response(resp.body, resp)
      cors.headers.set('Access-Control-Allow-Origin', '*')
      cors.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
      cors.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type')
      return cors
    }

    return new Response('Not found', { status: 404 })
  },
}
