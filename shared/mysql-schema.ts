import { sql } from "drizzle-orm";
import { mysqlTable, varchar, text, timestamp, int, boolean, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const businesses = mysqlTable("businesses", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  address: varchar("address", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  contactPerson: varchar("contact_person", { length: 255 }).notNull(),
  rating: int("rating").default(0),
  reviewCount: int("review_count").default(0),
  imageUrl: text("image_url"),
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const busRoutes = mysqlTable("bus_routes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  routeNumber: varchar("route_number", { length: 50 }).notNull(),
  routeName: varchar("route_name", { length: 255 }).notNull(),
  startLocation: varchar("start_location", { length: 255 }).notNull(),
  endLocation: varchar("end_location", { length: 255 }).notNull(),
  estimatedTime: int("estimated_time"), // in minutes
  isActive: boolean("is_active").default(true),
});

export const emergencyContacts = mysqlTable("emergency_contacts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  description: text("description"),
  isAvailable247: boolean("is_available_247").default(false),
});

export const announcements = mysqlTable("announcements", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  isUrgent: boolean("is_urgent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const outages = mysqlTable("outages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // 'water' or 'electricity'
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  affectedAreas: json("affected_areas"),
  isActive: boolean("is_active").default(true),
  source: varchar("source", { length: 100 }), // 'meski', 'toroslar-edas'
  externalId: varchar("external_id", { length: 100 }), // ID from external API
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const communityPosts = mysqlTable("community_posts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  authorId: varchar("author_id", { length: 36 }).references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  neighborhood: varchar("neighborhood", { length: 100 }),
  likes: int("likes").default(0),
  comments: int("comments").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users, {
  phone: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const insertBusinessSchema = createInsertSchema(businesses, {
  description: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  isPremium: z.boolean().default(false).optional(),
}).omit({
  id: true,
  createdAt: true,
  rating: true,
  reviewCount: true,
});

export const insertBusRouteSchema = createInsertSchema(busRoutes, {
  estimatedTime: z.number().nullable().optional(),
  isActive: z.boolean().default(true).optional(),
}).omit({
  id: true,
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts, {
  description: z.string().nullable().optional(),
  isAvailable247: z.boolean().default(false).optional(),
}).omit({
  id: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements, {
  isUrgent: z.boolean().default(false).optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts, {
  title: z.string().nullable().optional(),
  neighborhood: z.string().nullable().optional(),
}).omit({
  id: true,
  createdAt: true,
  likes: true,
  comments: true,
});

export const insertOutageSchema = createInsertSchema(outages, {
  startDate: z.date().nullable().optional(),
  endDate: z.date().nullable().optional(),
  affectedAreas: z.array(z.string()).nullable().optional(),
  source: z.string().nullable().optional(),
  externalId: z.string().nullable().optional(),
  isActive: z.boolean().default(true).optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Auth schemas
export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const businessLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const userRegisterSchema = insertUserSchema;
export const businessRegisterSchema = insertBusinessSchema;

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Business = typeof businesses.$inferSelect;

export type InsertBusRoute = z.infer<typeof insertBusRouteSchema>;
export type BusRoute = typeof busRoutes.$inferSelect;

export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;

export type InsertOutage = z.infer<typeof insertOutageSchema>;
export type Outage = typeof outages.$inferSelect;
