import Database from 'better-sqlite3'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  username: text('username').primaryKey().notNull(),
  password: text('password').notNull()
})
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

/**
 * Reflect the schemas above in the statements below!
 *
 * Can take a look inside a pre-existing SQLite file
 */
export function createDb(path: string): void {
  const sqlite = new Database(path)
  const db = drizzle(sqlite)

  db.run(sql`
    CREATE TABLE users (
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      PRIMARY KEY (username)
    )
  `)
  db.run(sql`
    CREATE TABLE products (
      sku TEXT NOT NULL,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      stock INTEGER NOT NULL,
      url TEXT,
      PRIMARY KEY (sku)
    )
  `)
}
