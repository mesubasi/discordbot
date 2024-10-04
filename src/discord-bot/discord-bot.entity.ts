import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const discordBotTable = pgTable("message", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  content: text("content").notNull(),
  usercontent: text("usercontent").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
});
