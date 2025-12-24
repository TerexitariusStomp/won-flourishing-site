import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertProjectSchema = z.object({
  name: z.string().min(2, "Project name is required."),
  type: z.string().min(2, "Category is required."),
  location: z.string().min(2, "Location is required."),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  desc: z.string().min(10, "Description is required."),
  website: z.string().url().optional(),
  contact: z.string().email().optional(),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Project = InsertProject & {
  id: string;
  submittedAt: string;
};
