import { mkdirSync } from 'fs'
import { getActualFilePath, isPathExisting } from './fs.js'

function initializeDirectories(): void {
  const dirs = ['data', 'data/images', 'data/receipts', 'data/temp']
  for (const dir of dirs) {
    const absolute = getActualFilePath(dir)
    if (isPathExisting(absolute)) continue
    mkdirSync(absolute)
  }
}

initializeDirectories()
