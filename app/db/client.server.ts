import { drizzle } from 'drizzle-orm/d1'

export const client = (database: D1Database) => drizzle(database)