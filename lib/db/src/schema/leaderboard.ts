import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leaderboardTable = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  rank: integer("rank").notNull(),
  username: text("username").notNull(),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  ecoScore: integer("eco_score").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  isCurrentUser: boolean("is_current_user").notNull().default(false),
  avatarUrl: text("avatar_url"),
});

export const insertLeaderboardSchema = createInsertSchema(leaderboardTable).omit({ id: true });
export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;
export type Leaderboard = typeof leaderboardTable.$inferSelect;
