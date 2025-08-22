import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { 
  insertBusinessSchema,
  insertBusRouteSchema,
  insertEmergencyContactSchema,
  insertAnnouncementSchema,
  insertCommunityPostSchema,
  insertOutageSchema,
  userLoginSchema,
  businessLoginSchema,
  userRegisterSchema,
  businessRegisterSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = userRegisterSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Kullanıcı zaten mevcut" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, type: 'user' },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '24h' }
      );
      
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          name: user.name,
          phone: user.phone,
          location: user.location
        } 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Kayıt işlemi başarısız" });
    }
  });

  app.post("/api/users/login", async (req, res) => {
    try {
      const loginData = userLoginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(loginData.email);
      if (!user) {
        return res.status(401).json({ message: "Geçersiz email veya şifre" });
      }
      
      // Check password
      const isValidPassword = await bcrypt.compare(loginData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Geçersiz email veya şifre" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, type: 'user' },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '24h' }
      );
      
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          name: user.name,
          phone: user.phone,
          location: user.location
        } 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Giriş işlemi başarısız" });
    }
  });

  app.post("/api/businesses/register", async (req, res) => {
    try {
      const businessData = businessRegisterSchema.parse(req.body);
      
      // Check if business already exists
      const existingBusiness = await storage.getBusinessByEmail(businessData.email);
      if (existingBusiness) {
        return res.status(400).json({ message: "İşletme zaten mevcut" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(businessData.password, 10);
      
      // Create business
      const business = await storage.createBusiness({
        ...businessData,
        password: hashedPassword
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { businessId: business.id, type: 'business' },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '24h' }
      );
      
      res.json({ 
        token, 
        business: { 
          id: business.id, 
          name: business.name, 
          email: business.email, 
          category: business.category,
          description: business.description,
          address: business.address,
          phone: business.phone,
          contactPerson: business.contactPerson
        } 
      });
    } catch (error) {
      console.error("Business registration error:", error);
      res.status(400).json({ message: "İşletme kayıt işlemi başarısız" });
    }
  });

  app.post("/api/businesses/login", async (req, res) => {
    try {
      const loginData = businessLoginSchema.parse(req.body);
      
      // Find business
      const business = await storage.getBusinessByEmail(loginData.email);
      if (!business) {
        return res.status(401).json({ message: "Geçersiz email veya şifre" });
      }
      
      // Check password
      const isValidPassword = await bcrypt.compare(loginData.password, business.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Geçersiz email veya şifre" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { businessId: business.id, type: 'business' },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '24h' }
      );
      
      res.json({ 
        token, 
        business: { 
          id: business.id, 
          name: business.name, 
          email: business.email, 
          category: business.category,
          description: business.description,
          address: business.address,
          phone: business.phone,
          contactPerson: business.contactPerson
        } 
      });
    } catch (error) {
      console.error("Business login error:", error);
      res.status(400).json({ message: "İşletme giriş işlemi başarısız" });
    }
  });
  
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

  // Outages
  app.get("/api/outages", async (req, res) => {
    try {
      const { type } = req.query;
      const outages = type
        ? await storage.getOutagesByType(type as string)
        : await storage.getActiveOutages();
      res.json(outages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch outages" });
    }
  });

  app.post("/api/outages", async (req, res) => {
    try {
      const validatedData = insertOutageSchema.parse(req.body);
      const outage = await storage.createOutage(validatedData);
      res.status(201).json(outage);
    } catch (error) {
      res.status(400).json({ message: "Invalid outage data" });
    }
  });

  // MESKİ Water Outages Integration
  app.get("/api/outages/meski/sync", async (req, res) => {
    try {
      const response = await fetch('https://online.meski.gov.tr/meta/subscription/interruptions');
      if (!response.ok) {
        throw new Error('MESKİ API request failed');
      }
      
      const meskiData = await response.json();
      const syncedOutages = [];

      for (const interruption of meskiData) {
        if (interruption.isActive === 1) {
          const outage = await storage.createOutage({
            type: "water",
            title: "Su Kesintisi",
            description: interruption.description,
            startDate: interruption.planningStartDate ? new Date(interruption.planningStartDate) : null,
            endDate: interruption.finishDate ? new Date(interruption.finishDate) : null,
            affectedAreas: interruption.districtList || [],
            isActive: true,
            source: "meski",
            externalId: interruption.id?.toString()
          });
          syncedOutages.push(outage);
        }
      }

      res.json({ 
        message: `${syncedOutages.length} MESKİ outage synchronized`,
        outages: syncedOutages 
      });
    } catch (error) {
      console.error('MESKİ sync error:', error);
      res.status(500).json({ message: "Failed to sync MESKİ data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
