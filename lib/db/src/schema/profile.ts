import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profileTable = pgTable("profile", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().default("EcoHero"),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  xpToNextLevel: integer("xp_to_next_level").notNull().default(500),
  ecoScore: integer("eco_score").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  rank: integer("rank").notNull().default(1),
  totalChallengesCompleted: integer("total_challenges_completed").notNull().default(0),
  avatarUrl: text("avatar_url"),
  title: text("title").notNull().default("Eco Beginner"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProfileSchema = createInsertSchema(profileTable).omit({ id: true, updatedAt: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profileTable.$inferSelect;
