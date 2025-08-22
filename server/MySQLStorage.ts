// MySQLStorage.ts
import mysql from 'mysql2/promise';
import { IStorage } from './storage';
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
import { randomUUID } from 'crypto';

const dbConfig = {
  host: process.env.DB_HOST || 'srv1787.hstgr.io',
  user: process.env.DB_USER || 'u588148465_terasus',
  password: process.env.DB_PASSWORD || 'Emreninyalanlari33_*',
  database: process.env.DB_NAME || 'u588148465_panel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306
};

export class MySQLStorage implements IStorage {
  private pool;

  constructor() {
    this.pool = mysql.createPool(dbConfig);
    this.initializeDatabase().catch(console.error);
  }

  // Veritabanı tablolarını oluşturan metod
  private async initializeDatabase() {
    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          location VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS businesses (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL,
          description TEXT,
          address VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          contact_person VARCHAR(255) NOT NULL,
          rating INT DEFAULT 0,
          review_count INT DEFAULT 0,
          image_url TEXT,
          is_premium BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS bus_routes (
          id VARCHAR(36) PRIMARY KEY,
          route_number VARCHAR(50) NOT NULL,
          route_name VARCHAR(255) NOT NULL,
          start_location VARCHAR(255) NOT NULL,
          end_location VARCHAR(255) NOT NULL,
          estimated_time INT,
          is_active BOOLEAN DEFAULT true
        )
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS emergency_contacts (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          description TEXT,
          is_available_247 BOOLEAN DEFAULT false
        )
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS announcements (
          id VARCHAR(36) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          category VARCHAR(100) NOT NULL,
          is_urgent BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS outages (
          id VARCHAR(36) PRIMARY KEY,
          type VARCHAR(50) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          start_date TIMESTAMP,
          end_date TIMESTAMP,
          affected_areas JSON,
          is_active BOOLEAN DEFAULT true,
          source VARCHAR(100),
          external_id VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS community_posts (
          id VARCHAR(36) PRIMARY KEY,
          author_id VARCHAR(36),
          title VARCHAR(255),
          content TEXT NOT NULL,
          neighborhood VARCHAR(100),
          likes INT DEFAULT 0,
          comments INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      console.log('Veritabanı tabloları oluşturuldu veya halihazırda mevcut');
    } catch (error) {
      console.error('Veritabanı başlatılırken hata oluştu:', error);
      throw error;
    }
  }

  // Users methods
  async getUser(id: string): Promise<User | undefined> {
    const [rows] = await this.pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [rows] = await this.pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] as User | undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [rows] = await this.pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] as User | undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const createdAt = new Date();
    
    await this.pool.query(
      'INSERT INTO users (id, username, email, password, name, phone, location, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, user.username, user.email, user.password, user.name, user.phone || null, user.location || null, createdAt]
    );
    
    const newUser: User = {
      id,
      username: user.username,
      email: user.email,
      password: user.password,
      name: user.name,
      phone: user.phone || null,
      location: user.location || null,
      createdAt
    };
    
    return newUser;
  }

  // Businesses methods
  async getBusinesses(): Promise<Business[]> {
    const [rows] = await this.pool.query('SELECT * FROM businesses');
    return rows as Business[];
  }

  async getBusinessesByCategory(category: string): Promise<Business[]> {
    const [rows] = await this.pool.query('SELECT * FROM businesses WHERE category = ?', [category]);
    return rows as Business[];
  }

  async getFeaturedBusinesses(): Promise<Business[]> {
    const [rows] = await this.pool.query('SELECT * FROM businesses WHERE is_premium = true ORDER BY rating DESC LIMIT 5');
    return rows as Business[];
  }

  async getBusinessByEmail(email: string): Promise<Business | undefined> {
    const [rows] = await this.pool.query('SELECT * FROM businesses WHERE email = ?', [email]);
    return rows[0] as Business | undefined;
  }

  async createBusiness(business: InsertBusiness): Promise<Business> {
    const id = randomUUID();
    const createdAt = new Date();
    
    await this.pool.query(
      'INSERT INTO businesses (id, name, category, description, address, phone, email, password, contact_person, image_url, is_premium, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, business.name, business.category, business.description || null, business.address, business.phone || null, business.email, business.password, business.contactPerson, business.imageUrl || null, business.isPremium || false, createdAt]
    );
    
    const newBusiness: Business = {
      id,
      name: business.name,
      category: business.category,
      description: business.description || null,
      address: business.address,
      phone: business.phone || null,
      email: business.email,
      password: business.password,
      contactPerson: business.contactPerson,
      rating: 0,
      reviewCount: 0,
      imageUrl: business.imageUrl || null,
      isPremium: business.isPremium || false,
      createdAt
    };
    
    return newBusiness;
  }

  // Bus Routes methods
  async getBusRoutes(): Promise<BusRoute[]> {
    const [rows] = await this.pool.query('SELECT * FROM bus_routes');
    return rows as BusRoute[];
  }

  async getActiveBusRoutes(): Promise<BusRoute[]> {
    const [rows] = await this.pool.query('SELECT * FROM bus_routes WHERE is_active = true');
    return rows as BusRoute[];
  }

  async createBusRoute(route: InsertBusRoute): Promise<BusRoute> {
    const id = randomUUID();
    
    await this.pool.query(
      'INSERT INTO bus_routes (id, route_number, route_name, start_location, end_location, estimated_time, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, route.routeNumber, route.routeName, route.startLocation, route.endLocation, route.estimatedTime || null, route.isActive ?? true]
    );
    
    const newRoute: BusRoute = {
      id,
      routeNumber: route.routeNumber,
      routeName: route.routeName,
      startLocation: route.startLocation,
      endLocation: route.endLocation,
      estimatedTime: route.estimatedTime || null,
      isActive: route.isActive ?? true
    };
    
    return newRoute;
  }

  // Emergency Contacts methods
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    const [rows] = await this.pool.query('SELECT * FROM emergency_contacts');
    return rows as EmergencyContact[];
  }

  async getEmergencyContactsByCategory(category: string): Promise<EmergencyContact[]> {
    const [rows] = await this.pool.query('SELECT * FROM emergency_contacts WHERE category = ?', [category]);
    return rows as EmergencyContact[];
  }

  async createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact> {
    const id = randomUUID();
    
    await this.pool.query(
      'INSERT INTO emergency_contacts (id, name, category, phone, description, is_available_247) VALUES (?, ?, ?, ?, ?, ?)',
      [id, contact.name, contact.category, contact.phone, contact.description || null, contact.isAvailable247 ?? false]
    );
    
    const newContact: EmergencyContact = {
      id,
      name: contact.name,
      category: contact.category,
      phone: contact.phone,
      description: contact.description || null,
      isAvailable247: contact.isAvailable247 ?? false
    };
    
    return newContact;
  }

  // Announcements methods
  async getAnnouncements(): Promise<Announcement[]> {
    const [rows] = await this.pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
    return rows as Announcement[];
  }

  async getRecentAnnouncements(limit: number = 5): Promise<Announcement[]> {
    const [rows] = await this.pool.query('SELECT * FROM announcements ORDER BY created_at DESC LIMIT ?', [limit]);
    return rows as Announcement[];
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const id = randomUUID();
    const createdAt = new Date();
    
    await this.pool.query(
      'INSERT INTO announcements (id, title, content, category, is_urgent, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, announcement.title, announcement.content, announcement.category, announcement.isUrgent ?? false, createdAt]
    );
    
    const newAnnouncement: Announcement = {
      id,
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      isUrgent: announcement.isUrgent ?? false,
      createdAt
    };
    
    return newAnnouncement;
  }

  // Community Posts methods
  async getCommunityPosts(): Promise<CommunityPost[]> {
    const [rows] = await this.pool.query(`
      SELECT cp.*, u.username, u.name as author_name 
      FROM community_posts cp 
      JOIN users u ON cp.author_id = u.id
      ORDER BY cp.created_at DESC
    `);
    return rows as CommunityPost[];
  }

  async getRecentCommunityPosts(limit: number = 10): Promise<CommunityPost[]> {
    const [rows] = await this.pool.query(`
      SELECT cp.*, u.username, u.name as author_name 
      FROM community_posts cp 
      JOIN users u ON cp.author_id = u.id
      ORDER BY cp.created_at DESC
      LIMIT ?
    `, [limit]);
    return rows as CommunityPost[];
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const id = randomUUID();
    const createdAt = new Date();
    
    await this.pool.query(
      'INSERT INTO community_posts (id, author_id, title, content, neighborhood, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, post.authorId, post.title, post.content, post.neighborhood, createdAt]
    );
    
    // Post ile birlikte kullanıcı bilgilerini al
    const [rows] = await this.pool.query(`
      SELECT cp.*, u.username, u.name as author_name 
      FROM community_posts cp 
      JOIN users u ON cp.author_id = u.id
      WHERE cp.id = ?
    `, [id]);
    
    return rows[0] as CommunityPost;
  }

  // Outages methods
  async getOutages(): Promise<Outage[]> {
    const [rows] = await this.pool.query('SELECT * FROM outages ORDER BY start_date DESC');
    
    // JSON stringini diziye dönüştür
    return (rows as any[]).map(row => ({
      ...row,
      affectedAreas: row.affected_areas ? JSON.parse(row.affected_areas) : []
    })) as Outage[];
  }

  async getActiveOutages(): Promise<Outage[]> {
    const [rows] = await this.pool.query('SELECT * FROM outages WHERE is_active = true ORDER BY start_date DESC');
    
    // JSON stringini diziye dönüştür
    return (rows as any[]).map(row => ({
      ...row,
      affectedAreas: row.affected_areas ? JSON.parse(row.affected_areas) : []
    })) as Outage[];
  }

  async getOutagesByType(type: string): Promise<Outage[]> {
    const [rows] = await this.pool.query('SELECT * FROM outages WHERE type = ? ORDER BY start_date DESC', [type]);
    
    // JSON stringini diziye dönüştür
    return (rows as any[]).map(row => ({
      ...row,
      affectedAreas: row.affected_areas ? JSON.parse(row.affected_areas) : []
    })) as Outage[];
  }

  async createOutage(outage: InsertOutage): Promise<Outage> {
    const id = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();
    
    // Dizi alanını JSON stringine dönüştür
    const affectedAreasJson = JSON.stringify(outage.affectedAreas || []);
    
    await this.pool.query(
      'INSERT INTO outages (id, type, title, description, start_date, end_date, affected_areas, is_active, source, external_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, outage.type, outage.title, outage.description, outage.startDate || null, outage.endDate || null, affectedAreasJson, outage.isActive ?? true, outage.source || null, outage.externalId || null, createdAt, updatedAt]
    );
    
    const newOutage: Outage = {
      id,
      type: outage.type,
      title: outage.title,
      description: outage.description,
      startDate: outage.startDate || null,
      endDate: outage.endDate || null,
      affectedAreas: outage.affectedAreas || [],
      isActive: outage.isActive ?? true,
      source: outage.source || null,
      externalId: outage.externalId || null,
      createdAt,
      updatedAt
    };
    
    return newOutage;
  }

  async updateOutage(id: string, outage: Partial<Outage>): Promise<Outage | undefined> {
    // Güncellenecek alanları kontrol et
    const updates: Record<string, any> = {};
    const params: any[] = [];
    
    Object.entries(outage).forEach(([key, value]) => {
      if (value !== undefined) {
        // Property adını snake_case formatına dönüştür
        let columnName = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        
        // 'affectedAreas' alanını JSON formatına dönüştür
        if (key === 'affectedAreas') {
          value = JSON.stringify(value);
          columnName = 'affected_areas';
        }
        
        updates[columnName] = value;
        params.push(value);
      }
    });
    
    // Güncellenecek alan yoksa işlemi sonlandır
    if (Object.keys(updates).length === 0) {
      return undefined;
    }
    
    // updated_at alanını otomatik güncelle
    updates.updated_at = new Date();
    params.push(new Date());
    
    // SQL sorgusu oluştur
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    params.push(id);
    
    await this.pool.query(`UPDATE outages SET ${setClause} WHERE id = ?`, params);
    
    // Güncellenmiş veriyi getir
    const [rows] = await this.pool.query('SELECT * FROM outages WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return undefined;
    }
    
    // JSON stringini diziye dönüştür
    const outageData = rows[0] as any;
    return {
      ...outageData,
      affectedAreas: outageData.affected_areas ? JSON.parse(outageData.affected_areas) : []
    } as Outage;
  }
}
