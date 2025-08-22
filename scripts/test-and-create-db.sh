#!/bin/bash

# MySQL veritabanı bilgileri
DB_HOST="srv1787.hstgr.io"
DB_PORT="3306"
DB_USER="u588148465_panel"
DB_PASSWORD="Emreninyalanlari33_*"
DB_NAME="u588148465_tarsusgo"

# MySQL bağlantısı testi
echo "MySQL bağlantısı test ediliyor..."
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD -e "SELECT 'Bağlantı başarılı';"

# Test başarılıysa veritabanı oluşturma
if [ $? -eq 0 ]; then
  echo "Veritabanı oluşturuluyor..."
  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
  
  if [ $? -eq 0 ]; then
    echo "Veritabanı başarıyla oluşturuldu."
  else
    echo "Veritabanı oluşturulamadı."
    exit 1
  fi
  
  # Tablolar oluşturuluyor
  echo "Tablolar oluşturuluyor..."
  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      location VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

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
    );

    CREATE TABLE IF NOT EXISTS bus_routes (
      id VARCHAR(36) PRIMARY KEY,
      route_number VARCHAR(50) NOT NULL,
      route_name VARCHAR(255) NOT NULL,
      start_location VARCHAR(255) NOT NULL,
      end_location VARCHAR(255) NOT NULL,
      estimated_time INT,
      is_active BOOLEAN DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS emergency_contacts (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      description TEXT,
      is_available_247 BOOLEAN DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      is_urgent BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS outages (
      id VARCHAR(36) PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      start_date TIMESTAMP NULL,
      end_date TIMESTAMP NULL,
      affected_areas JSON,
      is_active BOOLEAN DEFAULT true,
      source VARCHAR(100),
      external_id VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

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
    );
  "
  
  if [ $? -eq 0 ]; then
    echo "Tablolar başarıyla oluşturuldu."
  else
    echo "Tablolar oluşturulurken hata oluştu."
    exit 1
  fi
  
else
  echo "MySQL bağlantısı kurulamadı."
  exit 1
fi
