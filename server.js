import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // Servir arquivos estáticos com cache de 1 ano
  app.use(express.static(path.resolve(__dirname, 'dist/client'), {
    maxAge: '1y',
    immutable: true,
    index: false
  }))

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      let template = await fs.readFile(
        path.resolve(__dirname, 'dist/client/index.html'),
        'utf-8'
      )

      // Em produção, importamos o bundle do servidor gerado pelo build
      const render = (await import('./dist/server/entry-server.js')).render

      const appHtml = await render(url)

      const html = template.replace(`<!--ssr-outlet-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app }
}

createServer().then(({ app }) =>
  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000')
  })
)
