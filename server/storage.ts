import { 
  type User, 
  type InsertUser,
  type Business,
  type InsertBusiness,
  type BusRoute,
  type InsertBusRoute,
  type EmergencyContact,
  type InsertEmergencyContact,
  type Announcement,
  type InsertAnnouncement,
  type CommunityPost,
  type InsertCommunityPost
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Businesses
  getBusinesses(): Promise<Business[]>;
  getBusinessesByCategory(category: string): Promise<Business[]>;
  getFeaturedBusinesses(): Promise<Business[]>;
  createBusiness(business: InsertBusiness): Promise<Business>;

  // Bus Routes
  getBusRoutes(): Promise<BusRoute[]>;
  getActiveBusRoutes(): Promise<BusRoute[]>;
  createBusRoute(route: InsertBusRoute): Promise<BusRoute>;

  // Emergency Contacts
  getEmergencyContacts(): Promise<EmergencyContact[]>;
  getEmergencyContactsByCategory(category: string): Promise<EmergencyContact[]>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;

  // Announcements
  getAnnouncements(): Promise<Announcement[]>;
  getRecentAnnouncements(limit?: number): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;

  // Community Posts
  getCommunityPosts(): Promise<CommunityPost[]>;
  getRecentCommunityPosts(limit?: number): Promise<CommunityPost[]>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private businesses: Map<string, Business>;
  private busRoutes: Map<string, BusRoute>;
  private emergencyContacts: Map<string, EmergencyContact>;
  private announcements: Map<string, Announcement>;
  private communityPosts: Map<string, CommunityPost>;

  constructor() {
    this.users = new Map();
    this.businesses = new Map();
    this.busRoutes = new Map();
    this.emergencyContacts = new Map();
    this.announcements = new Map();
    this.communityPosts = new Map();

    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Sample businesses
    const sampleBusinesses: InsertBusiness[] = [
      {
        name: "Tarsus Börek Evi",
        category: "Restoran",
        description: "Geleneksel Tarsus böreği ve ev yemekleri",
        address: "Cumhuriyet Mahallesi, Atatürk Caddesi No: 45",
        phone: "+90 324 123 4567",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=120&fit=crop",
        isPremium: true
      },
      {
        name: "Şelale Kafe",
        category: "Kafe",
        description: "Tarsus Şelalesi manzaralı kahve ve tatlı",
        address: "Şelale Mahallesi, Şelale Caddesi No: 12",
        phone: "+90 324 987 6543",
        imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=120&fit=crop",
        isPremium: true
      }
    ];

    for (const business of sampleBusinesses) {
      await this.createBusiness(business);
    }

    // Sample bus routes
    const sampleRoutes: InsertBusRoute[] = [
      {
        routeNumber: "12",
        routeName: "Merkez - Üniversite",
        startLocation: "Cumhuriyet Meydanı",
        endLocation: "Tarsus Üniversitesi",
        estimatedTime: 3,
        isActive: true
      },
      {
        routeNumber: "25",
        routeName: "Gülek - Merkez",
        startLocation: "Gülek Mahallesi",
        endLocation: "Cumhuriyet Meydanı",
        estimatedTime: 7,
        isActive: true
      }
    ];

    for (const route of sampleRoutes) {
      await this.createBusRoute(route);
    }

    // Sample emergency contacts
    const sampleEmergencyContacts: InsertEmergencyContact[] = [
      {
        name: "Polis",
        category: "Güvenlik",
        phone: "155",
        description: "Acil polis yardımı",
        isAvailable247: true
      },
      {
        name: "İtfaiye",
        category: "Güvenlik",
        phone: "110",
        description: "Yangın ve kurtarma",
        isAvailable247: true
      },
      {
        name: "Ambulans",
        category: "Sağlık",
        phone: "112",
        description: "Acil sağlık hizmetleri",
        isAvailable247: true
      },
      {
        name: "Tarsus Devlet Hastanesi",
        category: "Sağlık",
        phone: "+90 324 241 1000",
        description: "Ana hastane",
        isAvailable247: true
      }
    ];

    for (const contact of sampleEmergencyContacts) {
      await this.createEmergencyContact(contact);
    }

    // Sample announcements
    const sampleAnnouncements: InsertAnnouncement[] = [
      {
        title: "Su Kesintisi Uyarısı",
        content: "Yarın 09:00-17:00 saatleri arasında Gülek Mahallesi'nde su kesintisi yaşanacaktır.",
        category: "Altyapı",
        isUrgent: true
      },
      {
        title: "Cumhuriyet Meydanı Etkinliği",
        content: "Bu akşam 19:00'da Cumhuriyet Meydanı'nda çocuklar için ücretsiz etkinlik.",
        category: "Etkinlik",
        isUrgent: false
      }
    ];

    for (const announcement of sampleAnnouncements) {
      await this.createAnnouncement(announcement);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Business methods
  async getBusinesses(): Promise<Business[]> {
    return Array.from(this.businesses.values());
  }

  async getBusinessesByCategory(category: string): Promise<Business[]> {
    return Array.from(this.businesses.values()).filter(
      business => business.category === category
    );
  }

  async getFeaturedBusinesses(): Promise<Business[]> {
    return Array.from(this.businesses.values()).filter(
      business => business.isPremium
    );
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const id = randomUUID();
    const business: Business = {
      ...insertBusiness,
      id,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date()
    };
    this.businesses.set(id, business);
    return business;
  }

  // Bus Route methods
  async getBusRoutes(): Promise<BusRoute[]> {
    return Array.from(this.busRoutes.values());
  }

  async getActiveBusRoutes(): Promise<BusRoute[]> {
    return Array.from(this.busRoutes.values()).filter(
      route => route.isActive
    );
  }

  async createBusRoute(insertRoute: InsertBusRoute): Promise<BusRoute> {
    const id = randomUUID();
    const route: BusRoute = { ...insertRoute, id };
    this.busRoutes.set(id, route);
    return route;
  }

  // Emergency Contact methods
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    return Array.from(this.emergencyContacts.values());
  }

  async getEmergencyContactsByCategory(category: string): Promise<EmergencyContact[]> {
    return Array.from(this.emergencyContacts.values()).filter(
      contact => contact.category === category
    );
  }

  async createEmergencyContact(insertContact: InsertEmergencyContact): Promise<EmergencyContact> {
    const id = randomUUID();
    const contact: EmergencyContact = { ...insertContact, id };
    this.emergencyContacts.set(id, contact);
    return contact;
  }

  // Announcement methods
  async getAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getRecentAnnouncements(limit: number = 5): Promise<Announcement[]> {
    const all = await this.getAnnouncements();
    return all.slice(0, limit);
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = randomUUID();
    const announcement: Announcement = {
      ...insertAnnouncement,
      id,
      createdAt: new Date()
    };
    this.announcements.set(id, announcement);
    return announcement;
  }

  // Community Post methods
  async getCommunityPosts(): Promise<CommunityPost[]> {
    return Array.from(this.communityPosts.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getRecentCommunityPosts(limit: number = 5): Promise<CommunityPost[]> {
    const all = await this.getCommunityPosts();
    return all.slice(0, limit);
  }

  async createCommunityPost(insertPost: InsertCommunityPost): Promise<CommunityPost> {
    const id = randomUUID();
    const post: CommunityPost = {
      ...insertPost,
      id,
      likes: 0,
      comments: 0,
      createdAt: new Date()
    };
    this.communityPosts.set(id, post);
    return post;
  }
}

export const storage = new MemStorage();
