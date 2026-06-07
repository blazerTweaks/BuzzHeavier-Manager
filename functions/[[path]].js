export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const path = url.pathname

  if (path.startsWith('/api')) {
    const target = `https://buzzheavier.com${path.replace('/api', '')}${url.search}`
    const headers = new Headers(request.headers)
    headers.set('host', 'buzzheavier.com')
    return fetch(target, {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? null : request.body,
    })
  }

  if (path.startsWith('/upload')) {
    const target = `https://w.buzzheavier.com${path.replace('/upload', '')}${url.search}`
    const headers = new Headers(request.headers)
    headers.set('host', 'w.buzzheavier.com')
    return fetch(target, {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? null : request.body,
    })
  }

  const response = await env.ASSETS.fetch(request)
  if (response.status === 404) {
    return env.ASSETS.fetch(new Request(new URL('/index.html', url), request))
  }
  return response
}
