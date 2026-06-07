import { request } from 'https'

export const config = {
  runtime: 'nodejs',
}

export default async function handler(req, res) {
  const isUpload = req.url.startsWith('/upload')
  const targetHost = isUpload ? 'w.buzzheavier.com' : 'buzzheavier.com'
  const path = req.url.replace(/^\/(api|upload)/, '')

  const { headers } = req
  const options = {
    hostname: targetHost,
    port: 443,
    path,
    method: req.method,
    headers: {
      ...headers,
      host: targetHost,
    },
  }

  return new Promise((resolve, reject) => {
    const proxyReq = request(options, (proxyRes) => {
      res.statusCode = proxyRes.statusCode || 200
      Object.keys(proxyRes.headers).forEach((key) => {
        res.setHeader(key, proxyRes.headers[key])
      })
      proxyRes.pipe(res)
      proxyRes.on('end', resolve)
    })

    proxyReq.on('error', (err) => {
      res.statusCode = 500
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify({ error: err.message }))
      reject(err)
    })

    req.pipe(proxyReq)
  })
}
