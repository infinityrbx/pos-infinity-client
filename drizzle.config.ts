import type { Config } from 'drizzle-kit'

export default {
  schema: 'src/main/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'data/data.sqlite'
  }
} satisfies Config
