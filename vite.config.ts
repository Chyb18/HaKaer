import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const repo = process.env.GITHUB_REPOSITORY_NAME ?? 'HaKaer'

/** 开发时避免误用仓库里用于 Pages 的 production 静态资源 */
function devGuardPlugin(isDev: boolean): Plugin {
  return {
    name: 'dev-guard',
    configureServer(server) {
      if (!isDev) return
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (url.startsWith(`/assets/index.`) && (url.endsWith('.js') || url.endsWith('.css'))) {
          res.statusCode = 404
          res.end('Use npm run dev — bundled /assets/* are for GitHub Pages only.')
          return
        }
        const needsDevHtml =
          url === '/' ||
          url === '/index.html' ||
          url === `/${repo}` ||
          url === `/${repo}/` ||
          url === `/${repo}/index.html`
        if (needsDevHtml) {
          const qs = req.url?.includes('?') ? `?${req.url.split('?')[1]}` : ''
          req.url = `/index.html${qs}`
        }
        next()
      })
    },
  }
}

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'

  return {
    base: isDev ? '/' : `/${repo}/`,
    plugins: [react(), devGuardPlugin(isDev)],
    server: {
      open: '/',
      strictPort: false,
    },
    build: {
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
      },
    },
  }
})
