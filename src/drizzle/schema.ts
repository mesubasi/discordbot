import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const message = pgTable("message", {
	id: serial("id").primaryKey().notNull(),
	username: varchar("username").notNull(),
	content: varchar("content").notNull(),
	usercontent: varchar("usercontent").notNull(),
	timestamp: timestamp("timestamp", { withTimezone: true, mode: 'string' }).notNull(),
});