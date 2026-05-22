import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const repo = process.env.GITHUB_REPOSITORY_NAME ?? 'HaKaer'

function devIndexPlugin(): Plugin {
  return {
    name: 'dev-index',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url?.split('?')[0]
        if (url === '/' || url === '/index.html') {
          const qs = req.url?.includes('?') ? `?${req.url.split('?')[1]}` : ''
          req.url = `/index.dev.html${qs}`
        }
        next()
      })
    },
  }
}

export default defineConfig({
  base: `/${repo}/`,
  plugins: [react(), devIndexPlugin()],
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'index.dev.html'),
    },
  },
})
