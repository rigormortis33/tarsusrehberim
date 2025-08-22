// seed-mysql-data.js
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
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

async function seedDatabase() {
  const pool = mysql.createPool(dbConfig);
  
  try {
    console.log('Örnek veriler ekleniyor...');
    
    // Örnek şifre (123456) hash edilmiş hali
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    // Örnek kullanıcılar
    const users = [
      {
        id: randomUUID(),
        username: "test_user",
        email: "test@tarsusgo.com",
        password: hashedPassword,
        name: "Test Kullanıcısı",
        phone: "+90 555 123 4567",
        location: "Tarsus, Mersin",
        created_at: new Date()
      },
      {
        id: randomUUID(),
        username: "ahmet_tarsus",
        email: "ahmet@example.com",
        password: hashedPassword,
        name: "Ahmet Yılmaz",
        phone: "+90 555 987 6543",
        location: "Merkez, Tarsus",
        created_at: new Date()
      },
      {
        id: randomUUID(),
        username: "ayse_33",
        email: "ayse@example.com",
        password: hashedPassword,
        name: "Ayşe Demir",
        phone: "+90 555 333 2211",
        location: "Toroslar, Mersin",
        created_at: new Date()
      }
    ];
    
    // Örnek işletmeler
    const businesses = [
      {
        id: randomUUID(),
        name: "Tarsus Lokantası",
        category: "Restoran",
        description: "Geleneksel Tarsus lezzetleri sunan aile restoranı.",
        address: "Atatürk Cad. No:123, Tarsus",
        phone: "+90 324 555 4433",
        email: "tarsus_lokantasi@example.com",
        password: hashedPassword,
        contact_person: "Mehmet Kaya",
        rating: 4,
        review_count: 24,
        image_url: "https://example.com/images/tarsus_lokanta.jpg",
        is_premium: true,
        created_at: new Date()
      },
      {
        id: randomUUID(),
        name: "Bereket Market",
        category: "Market",
        description: "Semt marketi - her ihtiyacınız için.",
        address: "Gazi Mah. 45.Sok No:12, Tarsus",
        phone: "+90 324 555 7788",
        email: "bereket_market@example.com",
        password: hashedPassword,
        contact_person: "Ali Yıldız",
        rating: 3,
        review_count: 15,
        image_url: "https://example.com/images/bereket_market.jpg",
        is_premium: false,
        created_at: new Date()
      }
    ];
    
    // Örnek otobüs güzergahları
    const busRoutes = [
      {
        id: randomUUID(),
        route_number: "T1",
        route_name: "Merkez - Adanalıoğlu",
        start_location: "Merkez Durak",
        end_location: "Adanalıoğlu Son Durak",
        estimated_time: 45,
        is_active: true
      },
      {
        id: randomUUID(),
        route_number: "T2",
        route_name: "Merkez - Yenice",
        start_location: "Merkez Durak",
        end_location: "Yenice Durak",
        estimated_time: 30,
        is_active: true
      },
      {
        id: randomUUID(),
        route_number: "T3",
        route_name: "Şehir İçi Ring",
        start_location: "Atatürk Meydanı",
        end_location: "Atatürk Meydanı",
        estimated_time: 20,
        is_active: true
      }
    ];
    
    // Örnek acil durum numaraları
    const emergencyContacts = [
      {
        id: randomUUID(),
        name: "Tarsus Devlet Hastanesi",
        category: "Sağlık",
        phone: "112",
        description: "Tarsus ilçe hastanesi",
        is_available_247: true
      },
      {
        id: randomUUID(),
        name: "Tarsus İtfaiye",
        category: "İtfaiye",
        phone: "110",
        description: "Yangın, kurtarma ve diğer acil durumlar için",
        is_available_247: true
      },
      {
        id: randomUUID(),
        name: "Tarsus Emniyet Müdürlüğü",
        category: "Güvenlik",
        phone: "155",
        description: "Polis acil yardım hattı",
        is_available_247: true
      }
    ];
    
    // Örnek duyurular
    const announcements = [
      {
        id: randomUUID(),
        title: "Su Kesintisi Duyurusu",
        content: "Altyapı çalışmaları nedeniyle yarın 09:00-15:00 saatleri arasında Şehitishak Mahallesi'nde su kesintisi yaşanacaktır.",
        category: "Altyapı",
        is_urgent: true,
        created_at: new Date()
      },
      {
        id: randomUUID(),
        title: "Yol Çalışması Duyurusu",
        content: "Atatürk Caddesi üzerinde asfalt yenileme çalışması nedeniyle 10-15 Ağustos tarihleri arasında trafik alternatif güzergahlara yönlendirilecektir.",
        category: "Altyapı",
        is_urgent: false,
        created_at: new Date()
      }
    ];
    
    // Örnek kesintiler
    const outages = [
      {
        id: randomUUID(),
        type: "water",
        title: "Şebekede Arıza",
        description: "Ana su borusundaki arıza nedeniyle kesinti yaşanmaktadır.",
        start_date: new Date(),
        end_date: new Date(Date.now() + 86400000), // 1 gün sonra
        affected_areas: JSON.stringify(["Şehitishak", "Kızılmurat", "Caminur"]),
        is_active: true,
        source: "meski",
        external_id: "MSK-2023-123",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: randomUUID(),
        type: "electricity",
        title: "Planlı Elektrik Kesintisi",
        description: "Trafo bakımı nedeniyle planlı elektrik kesintisi yaşanacaktır.",
        start_date: new Date(Date.now() + 172800000), // 2 gün sonra
        end_date: new Date(Date.now() + 194400000), // 2 gün + 6 saat sonra
        affected_areas: JSON.stringify(["Kızılmurat", "Yenice", "Şahin"]),
        is_active: true,
        source: "toroslar-edas",
        external_id: "TRS-2023-456",
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    // Örnek verileri ekleyelim
    for (const user of users) {
      await pool.query(
        'INSERT INTO users (id, username, email, password, name, phone, location, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [user.id, user.username, user.email, user.password, user.name, user.phone, user.location, user.created_at]
      );
    }
    console.log(`${users.length} kullanıcı eklendi.`);
    
    for (const business of businesses) {
      await pool.query(
        'INSERT INTO businesses (id, name, category, description, address, phone, email, password, contact_person, rating, review_count, image_url, is_premium, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [business.id, business.name, business.category, business.description, business.address, business.phone, business.email, business.password, business.contact_person, business.rating, business.review_count, business.image_url, business.is_premium, business.created_at]
      );
    }
    console.log(`${businesses.length} işletme eklendi.`);
    
    for (const route of busRoutes) {
      await pool.query(
        'INSERT INTO bus_routes (id, route_number, route_name, start_location, end_location, estimated_time, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [route.id, route.route_number, route.route_name, route.start_location, route.end_location, route.estimated_time, route.is_active]
      );
    }
    console.log(`${busRoutes.length} otobüs güzergahı eklendi.`);
    
    for (const contact of emergencyContacts) {
      await pool.query(
        'INSERT INTO emergency_contacts (id, name, category, phone, description, is_available_247) VALUES (?, ?, ?, ?, ?, ?)',
        [contact.id, contact.name, contact.category, contact.phone, contact.description, contact.is_available_247]
      );
    }
    console.log(`${emergencyContacts.length} acil durum numarası eklendi.`);
    
    for (const announcement of announcements) {
      await pool.query(
        'INSERT INTO announcements (id, title, content, category, is_urgent, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [announcement.id, announcement.title, announcement.content, announcement.category, announcement.is_urgent, announcement.created_at]
      );
    }
    console.log(`${announcements.length} duyuru eklendi.`);
    
    for (const outage of outages) {
      await pool.query(
        'INSERT INTO outages (id, type, title, description, start_date, end_date, affected_areas, is_active, source, external_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [outage.id, outage.type, outage.title, outage.description, outage.start_date, outage.end_date, outage.affected_areas, outage.is_active, outage.source, outage.external_id, outage.created_at, outage.updated_at]
      );
    }
    console.log(`${outages.length} kesinti eklendi.`);
    
    // Örnek topluluk gönderileri
    for (let i = 0; i < 5; i++) {
      const userId = users[Math.floor(Math.random() * users.length)].id;
      const postId = randomUUID();
      const neighborhoods = ["Şehitishak", "Kızılmurat", "Yenice", "Caminur", "Toroslar"];
      const titles = ["Mahalle etkinliği", "Çevre temizliği", "Park sorunu", "Sokak hayvanları", "Trafik problemi"];
      
      await pool.query(
        'INSERT INTO community_posts (id, author_id, title, content, neighborhood, likes, comments, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          postId,
          userId,
          titles[i],
          `Bu bir örnek topluluk gönderisi içeriğidir. Gönderi #${i+1}`,
          neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
          Math.floor(Math.random() * 20),
          Math.floor(Math.random() * 5),
          new Date(Date.now() - Math.floor(Math.random() * 7 * 86400000)) // son 7 gün içinde
        ]
      );
    }
    console.log("5 topluluk gönderisi eklendi.");
    
    console.log('Tüm örnek veriler başarıyla eklendi.');
  } catch (error) {
    console.error('Örnek veriler eklenirken hata oluştu:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase().catch(console.error);
