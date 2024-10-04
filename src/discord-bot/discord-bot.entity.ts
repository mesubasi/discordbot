import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const discordBotTable = pgTable("discord_bot", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  content: text("content").notNull(),
  aicontent: text("aicontent").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
});
