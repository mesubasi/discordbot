import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const message = pgTable("message", {
	id: serial("id").primaryKey().notNull(),
	username: varchar("username").notNull(),
	content: varchar("content").notNull(),
	usercontent: varchar("usercontent").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: 'string' }).notNull(),
});