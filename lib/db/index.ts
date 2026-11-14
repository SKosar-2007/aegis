import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

type DatabaseGlobal = typeof globalThis & { bookingPool?: Pool }
const globalForDatabase = globalThis as DatabaseGlobal

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new Error('DATABASE_URL is required to save booking demo submissions.')

  const pool = globalForDatabase.bookingPool ?? new Pool({ connectionString: databaseUrl, max: 5 })
  globalForDatabase.bookingPool = pool

  return drizzle(pool, { schema })
}
