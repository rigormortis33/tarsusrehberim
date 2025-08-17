import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const businesses = pgTable("businesses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  phone: text("phone"),
  rating: integer("rating").default(0),
  reviewCount: integer("review_count").default(0),
  imageUrl: text("image_url"),
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const busRoutes = pgTable("bus_routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeNumber: text("route_number").notNull(),
  routeName: text("route_name").notNull(),
  startLocation: text("start_location").notNull(),
  endLocation: text("end_location").notNull(),
  estimatedTime: integer("estimated_time"), // in minutes
  isActive: boolean("is_active").default(true),
});

export const emergencyContacts = pgTable("emergency_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  phone: text("phone").notNull(),
  description: text("description"),
  isAvailable247: boolean("is_available_247").default(false),
});

export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  isUrgent: boolean("is_urgent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").references(() => users.id),
  title: text("title"),
  content: text("content").notNull(),
  neighborhood: text("neighborhood"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertBusinessSchema = createInsertSchema(businesses).omit({
  id: true,
  createdAt: true,
  rating: true,
  reviewCount: true,
});

export const insertBusRouteSchema = createInsertSchema(busRoutes).omit({
  id: true,
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({
  id: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  createdAt: true,
  likes: true,
  comments: true,
});

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
