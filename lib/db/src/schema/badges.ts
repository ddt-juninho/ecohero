import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const badgesTable = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  earned: boolean("earned").notNull().default(false),
  earnedAt: text("earned_at"),
  category: text("category").notNull(),
  rarity: text("rarity").notNull().default("common"),
});

export const insertBadgeSchema = createInsertSchema(badgesTable).omit({ id: true });
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badgesTable.$inferSelect;
