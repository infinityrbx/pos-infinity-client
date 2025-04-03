import { mkdirSync } from 'fs'
import { join } from 'path'
import os from 'os'
import { getActualFilePath, isPathExisting } from './fs.js'

function getUserDataPath(): string {
  const platform = process.platform
  const home = os.homedir()
  const appName = 'YourAppName' // Change this to your app's name

  switch (platform) {
    case 'win32':
      return join(process.env.APPDATA || join(home, 'AppData', 'Roaming'), appName)
    case 'darwin':
      return join(home, 'Library', 'Application Support', appName)
    default: // linux and others
      return join(process.env.XDG_CONFIG_HOME || join(home, '.config'), appName)
  }
}

function initializeDirectories(): void {
  const baseDir = getUserDataPath()
  const dirs = [
    `${baseDir}/data`,
    `${baseDir}/data/images`,
    `${baseDir}/data/receipts`,
    `${baseDir}/data/temp`
  ]

  for (const dir of dirs) {
    const absolute = getActualFilePath(dir)
    if (isPathExisting(absolute)) continue
    mkdirSync(absolute, { recursive: true }) // just in case parent folders don't exist
  }
}

initializeDirectories()
