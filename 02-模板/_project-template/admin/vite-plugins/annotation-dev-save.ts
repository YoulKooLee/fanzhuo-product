import fs from 'fs/promises'
import path from 'path'
import type { Plugin } from 'vite'

/**
 * 开发时把标注保存到 public/annotations/{page}.json，避免 /api 被代理到后端导致保存失败。
 */
export function annotationDevSavePlugin(root: string): Plugin {
  return {
    name: 'annotation-dev-save',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (url !== '/__dev/annotation/save' || req.method !== 'POST') {
          next()
          return
        }
        const chunks: Buffer[] = []
        req.on('data', (c: Buffer) => chunks.push(c))
        req.on('end', () => {
          void (async () => {
            try {
              const raw = Buffer.concat(chunks).toString('utf8')
              const data = JSON.parse(raw) as { page?: string }
              const pageKey =
                typeof data.page === 'string'
                  ? data.page.replace(/^\//, '').replace(/\//g, '-') || 'index'
                  : 'index'
              const dir = path.join(root, 'public', 'annotations')
              await fs.mkdir(dir, { recursive: true })
              const filePath = path.join(dir, `${pageKey}.json`)
              await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: true }))
            } catch (e) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: String(e) }))
            }
          })()
        })
      })
    }
  }
}
