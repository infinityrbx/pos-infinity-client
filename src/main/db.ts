import path from 'path'
import { app } from 'electron'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { createDb } from './db/schema.js'
import { isPathExisting } from './fs.js'

const DB_FILE_PATH = path.join(app.getPath('userData'), 'database.sqlite')

if (!isPathExisting(DB_FILE_PATH)) {
  createDb(DB_FILE_PATH)
}

const sqlite = new Database(DB_FILE_PATH, { fileMustExist: true })
export const db = drizzle(sqlite)
