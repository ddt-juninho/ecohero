import { pgTable, text, serial, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const recyclingCategoriesTable = pgTable("recycling_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  description: text("description").notNull().default(""),
});

export const recyclingItemsTable = pgTable("recycling_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  name: text("name").notNull(),
  canRecycle: boolean("can_recycle").notNull().default(true),
  instructions: text("instructions").notNull(),
  tip: text("tip").notNull(),
  icon: text("icon").notNull().default("recycle"),
});

export const insertRecyclingCategorySchema = createInsertSchema(recyclingCategoriesTable).omit({ id: true });
export const insertRecyclingItemSchema = createInsertSchema(recyclingItemsTable).omit({ id: true });
export type InsertRecyclingCategory = z.infer<typeof insertRecyclingCategorySchema>;
export type InsertRecyclingItem = z.infer<typeof insertRecyclingItemSchema>;
export type RecyclingCategory = typeof recyclingCategoriesTable.$inferSelect;
export type RecyclingItem = typeof recyclingItemsTable.$inferSelect;
