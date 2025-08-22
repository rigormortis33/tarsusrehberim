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
  type InsertCommunityPost,
  type Outage,
  type InsertOutage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Businesses
  getBusinesses(): Promise<Business[]>;
  getBusinessesByCategory(category: string): Promise<Business[]>;
  getFeaturedBusinesses(): Promise<Business[]>;
  getBusinessByEmail(email: string): Promise<Business | undefined>;
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

  // Outages
  getOutages(): Promise<Outage[]>;
  getActiveOutages(): Promise<Outage[]>;
  getOutagesByType(type: string): Promise<Outage[]>;
  createOutage(outage: InsertOutage): Promise<Outage>;
  updateOutage(id: string, outage: Partial<Outage>): Promise<Outage | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private businesses: Map<string, Business>;
  private busRoutes: Map<string, BusRoute>;
  private emergencyContacts: Map<string, EmergencyContact>;
  private announcements: Map<string, Announcement>;
  private communityPosts: Map<string, CommunityPost>;
  private outages: Map<string, Outage>;

  constructor() {
    this.users = new Map();
    this.businesses = new Map();
    this.busRoutes = new Map();
    this.emergencyContacts = new Map();
    this.announcements = new Map();
    this.communityPosts = new Map();
    this.outages = new Map();

    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Sample users for testing
    const sampleUsers: InsertUser[] = [
      {
        username: "test_user",
        email: "test@tarsusgo.com",
        password: "$2b$10$KFcDbzwGwQY98Z1Ppt8ZYuWrKYsIKggO17an6BhON.Lg36tUMrgUC", // 123456
        name: "Test Kullanıcısı",
        phone: "+90 555 123 4567",
        location: "Tarsus, Mersin"
      },
      {
        username: "ahmet_tarsus",
        email: "ahmet@example.com",
        password: "$2b$10$KFcDbzwGwQY98Z1Ppt8ZYuWrKYsIKggO17an6BhON.Lg36tUMrgUC", // 123456
        name: "Ahmet Yılmaz",
        phone: "+90 555 987 6543",
        location: "Merkez, Tarsus"
      }
    ];

    for (const user of sampleUsers) {
      await this.createUser(user);
    }

    // Sample businesses
    const sampleBusinesses: InsertBusiness[] = [
      {
        name: "Tarsus Börek Evi",
        category: "Restoran",
        description: "Geleneksel Tarsus böreği ve ev yemekleri",
        address: "Cumhuriyet Mahallesi, Atatürk Caddesi No: 45",
        phone: "+90 324 123 4567",
        email: "info@tarsusboregi.com",
        password: "$2b$10$KFcDbzwGwQY98Z1Ppt8ZYuWrKYsIKggO17an6BhON.Lg36tUMrgUC", // 123456
        contactPerson: "Mehmet Öztürk",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=120&fit=crop",
        isPremium: true
      },
      {
        name: "Şelale Kafe",
        category: "Kafe",
        description: "Tarsus Şelalesi manzaralı kahve ve tatlı",
        address: "Şelale Mahallesi, Şelale Caddesi No: 12",
        phone: "+90 324 987 6543",
        email: "info@selalekafe.com",
        password: "$2b$10$KFcDbzwGwQY98Z1Ppt8ZYuWrKYsIKggO17an6BhON.Lg36tUMrgUC", // 123456
        contactPerson: "Ayşe Yılmaz",
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
        name: "Acil Çağrı Merkezi (TÜM ACİL DURUMLAR)",
        category: "Acil",
        phone: "112",
        description: "Ambulans, İtfaiye, Polis, Jandarma - Tüm acil durumlar için TEK NUMARA",
        isAvailable247: true
      },
      {
        name: "Sahil Güvenlik",
        category: "Güvenlik",
        phone: "158",
        description: "Deniz kurtarma ve güvenlik",
        isAvailable247: true
      },
      {
        name: "Orman Yangını",
        category: "Güvenlik",
        phone: "177",
        description: "Orman yangını ihbar hattı",
        isAvailable247: true
      },
      {
        name: "AFAD",
        category: "Güvenlik",
        phone: "122",
        description: "Afet ve Acil Durum Yönetimi",
        isAvailable247: true
      },
      {
        name: "Doğalgaz Acil",
        category: "Altyapı",
        phone: "187",
        description: "Doğalgaz kaçağı ve acil durumlar",
        isAvailable247: true
      },
      {
        name: "Elektrik Arıza (TEDAŞ)",
        category: "Altyapı",
        phone: "186",
        description: "Elektrik kesintisi ve arıza bildirimi",
        isAvailable247: true
      },
      {
        name: "Tarsus Devlet Hastanesi",
        category: "Sağlık",
        phone: "0 (324) 613 47 00",
        description: "Tarsus'un ana devlet hastanesi. Fax: 0 (324) 613 23 58",
        isAvailable247: true
      },
      {
        name: "Tarsus Özel Yaşam Hastanesi",
        category: "Sağlık", 
        phone: "+90 324 614 14 14",
        description: "Özel hastane - Acil servis",
        isAvailable247: true
      },
      {
        name: "Tarsus Belediyesi",
        category: "Belediye",
        phone: "+90 324 614 27 00",
        description: "Belediye hizmetleri ve şikayetleri",
        isAvailable247: false
      },
      {
        name: "Tarsus Kaymakamlık",
        category: "Resmi",
        phone: "+90 324 614 10 26",
        description: "İlçe kaymakamlığı",
        isAvailable247: false
      },
      {
        name: "TASKİ (Su Arıza)",
        category: "Altyapı",
        phone: "+90 324 336 12 85",
        description: "Su kesintisi ve arıza bildirimi",
        isAvailable247: true
      },
      {
        name: "Alo 153 Çevre Hattı",
        category: "Çevre",
        phone: "153",
        description: "Çevre kirliliği ve şikayetleri",
        isAvailable247: true
      },
      {
        name: "Tarsus Emniyet Müdürlüğü",
        category: "Güvenlik",
        phone: "+90 324 614 10 41",
        description: "Tarsus polis merkezi (acil olmayan durumlar)",
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

    // Sample outages
    const sampleOutages: InsertOutage[] = [
      {
        type: "water",
        title: "Tarsus Su Kesintisi",
        description: "Gülek Mahallesi ve çevresinde su kesintisi yaşanacaktır.",
        startDate: new Date(),
        endDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours later
        affectedAreas: ["Gülek Mahallesi", "Çelebili Mahallesi"],
        isActive: true,
        source: "meski"
      }
    ];

    for (const outage of sampleOutages) {
      await this.createOutage(outage);
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      phone: insertUser.phone || null,
      location: insertUser.location || null,
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

  async getBusinessByEmail(email: string): Promise<Business | undefined> {
    return Array.from(this.businesses.values()).find(
      (business) => business.email === email,
    );
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const id = randomUUID();
    const business: Business = {
      ...insertBusiness,
      id,
      description: insertBusiness.description || null,
      phone: insertBusiness.phone || null,
      imageUrl: insertBusiness.imageUrl || null,
      isPremium: insertBusiness.isPremium || null,
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
    const route: BusRoute = { 
      ...insertRoute, 
      id,
      estimatedTime: insertRoute.estimatedTime || null,
      isActive: insertRoute.isActive || null
    };
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
    const contact: EmergencyContact = { 
      ...insertContact, 
      id,
      description: insertContact.description || null,
      isAvailable247: insertContact.isAvailable247 || null
    };
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
      isUrgent: insertAnnouncement.isUrgent || null,
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
      title: insertPost.title || null,
      authorId: insertPost.authorId || null,
      neighborhood: insertPost.neighborhood || null,
      likes: 0,
      comments: 0,
      createdAt: new Date()
    };
    this.communityPosts.set(id, post);
    return post;
  }

  // Outage methods
  async getOutages(): Promise<Outage[]> {
    return Array.from(this.outages.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getActiveOutages(): Promise<Outage[]> {
    return Array.from(this.outages.values()).filter(
      outage => outage.isActive
    );
  }

  async getOutagesByType(type: string): Promise<Outage[]> {
    return Array.from(this.outages.values()).filter(
      outage => outage.type === type && outage.isActive
    );
  }

  async createOutage(insertOutage: InsertOutage): Promise<Outage> {
    const id = randomUUID();
    const outage: Outage = {
      ...insertOutage,
      id,
      startDate: insertOutage.startDate || null,
      endDate: insertOutage.endDate || null,
      affectedAreas: insertOutage.affectedAreas || null,
      isActive: insertOutage.isActive || null,
      source: insertOutage.source || null,
      externalId: insertOutage.externalId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.outages.set(id, outage);
    return outage;
  }

  async updateOutage(id: string, updateData: Partial<Outage>): Promise<Outage | undefined> {
    const outage = this.outages.get(id);
    if (!outage) return undefined;
    
    const updatedOutage: Outage = {
      ...outage,
      ...updateData,
      updatedAt: new Date()
    };
    this.outages.set(id, updatedOutage);
    return updatedOutage;
  }
}

import { MySQLStorage } from "./MySQLStorage";

// Veritabanı türü seçimi (process.env.STORAGE_TYPE değerine göre)
// Üretim ortamında MySQL kullanacağız, geliştirme ortamında bellek depolama kullanabiliriz
const useMySQL = process.env.STORAGE_TYPE === 'mysql' || process.env.NODE_ENV === 'production';

export const storage: IStorage = useMySQL 
  ? new MySQLStorage() 
  : new MemStorage();
