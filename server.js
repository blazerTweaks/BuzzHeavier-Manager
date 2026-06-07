import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

const distPath = path.join(__dirname, 'dist')

app.use('/api', createProxyMiddleware({
  target: 'https://buzzheavier.com',
  changeOrigin: true,
  secure: true,
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.setHeader('host', 'buzzheavier.com')
    },
  },
}))

app.use('/upload', createProxyMiddleware({
  target: 'https://w.buzzheavier.com',
  changeOrigin: true,
  secure: true,
  pathRewrite: { '^/upload': '' },
}))

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('/{*path}', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
