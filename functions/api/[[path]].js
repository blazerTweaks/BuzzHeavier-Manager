export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  const headers = new Headers()
  const auth = request.headers.get('authorization')
  if (auth) headers.set('authorization', auth)
  headers.set('host', 'buzzheavier.com')
  headers.set('accept', 'application/json')
  headers.set('user-agent', 'Mozilla/5.0')

  const resp = await fetch(`https://buzzheavier.com${url.pathname}${url.search}`, {
    method: request.method,
    headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
  })

  return resp
}
