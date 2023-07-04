import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const jokes = sqliteTable('jokes', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  content: text('content').notNull(),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (users) => ({
  nameIdx: uniqueIndex('nameIdx').on(users.name)
}));