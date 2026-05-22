import { rename } from 'node:fs/promises'

try {
  await rename('dist/index.dev.html', 'dist/index.html')
} catch {
  // already index.html or missing
}
