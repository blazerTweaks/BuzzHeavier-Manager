export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)

  if (url.pathname.startsWith('/upload')) {
    const headers = new Headers()
    const auth = request.headers.get('authorization')
    if (auth) headers.set('authorization', auth)
    headers.set('host', 'w.buzzheavier.com')
    headers.set('user-agent', 'Mozilla/5.0')
    const ct = request.headers.get('content-type')
    if (ct) headers.set('content-type', ct)

    const resp = await fetch(`https://w.buzzheavier.com${url.pathname.replace('/upload', '')}${url.search}`, {
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
