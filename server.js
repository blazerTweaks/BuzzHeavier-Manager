import express from 'express'
import { request } from 'https'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000
const distPath = path.join(__dirname, 'dist')

function createProxy(targetHost, pathPrefix) {
  return (req, res) => {
    const path = req.url.replace(pathPrefix, '')
    const options = {
      hostname: targetHost,
      port: 443,
      path,
      method: req.method,
      headers: {
        ...req.headers,
        host: targetHost,
      },
    }
    const proxyReq = request(options, (proxyRes) => {
      res.statusCode = proxyRes.statusCode || 200
      Object.keys(proxyRes.headers).forEach((key) => {
        res.setHeader(key, proxyRes.headers[key])
      })
      proxyRes.pipe(res)
    })
    proxyReq.on('error', () => res.status(502).end())
    req.pipe(proxyReq)
  }
}

app.use('/api', createProxy('buzzheavier.com', /^\/api/))
app.use('/upload', createProxy('w.buzzheavier.com', /^\/upload/))

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('/{*path}', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
