import { cp, rm, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const distHtml = existsSync('dist/index.html')
  ? 'dist/index.html'
  : 'dist/index.dev.html'

if (!existsSync(distHtml)) {
  console.error('Run npm run build first.')
  process.exit(1)
}

await cp(distHtml, 'index.html')
if (existsSync('assets')) await rm('assets', { recursive: true, force: true })
await mkdir('assets', { recursive: true })
await cp('dist/assets', 'assets', { recursive: true })
await cp('public/.nojekyll', '.nojekyll')
console.log('Synced index.html, assets/, .nojekyll')
