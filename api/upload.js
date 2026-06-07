import { request } from 'https'

export const config = { runtime: 'nodejs' }

export default async function handler(req, res) {
  const path = req.query.path || ''
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''

  const options = {
    hostname: 'w.buzzheavier.com',
    port: 443,
    path: path + qs,
    method: req.method,
    headers: { ...req.headers, host: 'w.buzzheavier.com' },
  }

  return new Promise((resolve, reject) => {
    const proxyReq = request(options, (proxyRes) => {
      res.statusCode = proxyRes.statusCode || 200
      Object.keys(proxyRes.headers).forEach((k) => res.setHeader(k, proxyRes.headers[k]))
      proxyRes.pipe(res)
      proxyRes.on('end', resolve)
    })
    proxyReq.on('error', () => { res.statusCode = 502; res.end() })
    req.pipe(proxyReq)
  })
}
