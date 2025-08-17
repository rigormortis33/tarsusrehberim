import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBusinessSchema,
  insertBusRouteSchema,
  insertEmergencyContactSchema,
  insertAnnouncementSchema,
  insertCommunityPostSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Businesses
  app.get("/api/businesses", async (req, res) => {
    try {
      const { category } = req.query;
      const businesses = category 
        ? await storage.getBusinessesByCategory(category as string)
        : await storage.getBusinesses();
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch businesses" });
    }
  });

  app.get("/api/businesses/featured", async (req, res) => {
    try {
      const businesses = await storage.getFeaturedBusinesses();
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured businesses" });
    }
  });

  app.post("/api/businesses", async (req, res) => {
    try {
      const validatedData = insertBusinessSchema.parse(req.body);
      const business = await storage.createBusiness(validatedData);
      res.status(201).json(business);
    } catch (error) {
      res.status(400).json({ message: "Invalid business data" });
    }
  });

  // Bus Routes
  app.get("/api/bus-routes", async (req, res) => {
    try {
      const routes = await storage.getActiveBusRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bus routes" });
    }
  });

  app.post("/api/bus-routes", async (req, res) => {
    try {
      const validatedData = insertBusRouteSchema.parse(req.body);
      const route = await storage.createBusRoute(validatedData);
      res.status(201).json(route);
    } catch (error) {
      res.status(400).json({ message: "Invalid bus route data" });
    }
  });

  // Emergency Contacts
  app.get("/api/emergency-contacts", async (req, res) => {
    try {
      const { category } = req.query;
      const contacts = category
        ? await storage.getEmergencyContactsByCategory(category as string)
        : await storage.getEmergencyContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emergency contacts" });
    }
  });

  app.post("/api/emergency-contacts", async (req, res) => {
    try {
      const validatedData = insertEmergencyContactSchema.parse(req.body);
      const contact = await storage.createEmergencyContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      res.status(400).json({ message: "Invalid emergency contact data" });
    }
  });

  // Announcements
  app.get("/api/announcements", async (req, res) => {
    try {
      const { limit } = req.query;
      const announcements = limit
        ? await storage.getRecentAnnouncements(parseInt(limit as string))
        : await storage.getAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  app.post("/api/announcements", async (req, res) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(validatedData);
      res.status(201).json(announcement);
    } catch (error) {
      res.status(400).json({ message: "Invalid announcement data" });
    }
  });

  // Community Posts
  app.get("/api/community-posts", async (req, res) => {
    try {
      const { limit } = req.query;
      const posts = limit
        ? await storage.getRecentCommunityPosts(parseInt(limit as string))
        : await storage.getCommunityPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community posts" });
    }
  });

  app.post("/api/community-posts", async (req, res) => {
    try {
      const validatedData = insertCommunityPostSchema.parse(req.body);
      const post = await storage.createCommunityPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid community post data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
