#!/bin/bash

# MySQL veritabanı bilgileri
DB_HOST=${DB_HOST:-"srv1787.hstgr.io"}
DB_USER=${DB_USER:-"u588148465_terasus"}
DB_PASSWORD=${DB_PASSWORD:-"Emreninyalanlari33_*"}
DB_NAME=${DB_NAME:-"u588148465_panel"}
DB_PORT=${DB_PORT:-"3306"}

# Komut satırı parametreleri
command=$1
shift

function show_usage() {
  echo "Kullanım: $0 [komut] [seçenekler]"
  echo "Komutlar:"
  echo "  init              - Veritabanını oluşturur"
  echo "  migrate           - Tabloları oluşturur"
  echo "  seed              - Örnek verileri ekler"
  echo "  backup            - Veritabanını yedekler"
  echo "  restore [dosya]   - Veritabanını geri yükler"
  echo "  drop              - Veritabanını siler (DİKKAT!)"
  echo "  help              - Bu yardım mesajını gösterir"
  exit 1
}

function init_database() {
  echo "Veritabanı oluşturuluyor: $DB_NAME"
  mysql -h$DB_HOST -u$DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
  
  if [ $? -eq 0 ]; then
    echo "Veritabanı başarıyla oluşturuldu: $DB_NAME"
  else
    echo "Veritabanı oluşturulurken bir hata oluştu."
    exit 1
  fi
}

function migrate_database() {
  echo "Tablo yapılarını oluşturuluyor..."
  npx drizzle-kit push --config=mysql.config.ts
  
  if [ $? -eq 0 ]; then
    echo "Tablo yapıları başarıyla oluşturuldu."
  else
    echo "Tablo yapıları oluşturulurken bir hata oluştu."
    exit 1
  fi
}

function seed_database() {
  echo "Örnek veriler ekleniyor..."
  node scripts/seed-mysql-data.js
  
  if [ $? -eq 0 ]; then
    echo "Örnek veriler başarıyla eklendi."
  else
    echo "Örnek veriler eklenirken bir hata oluştu."
    exit 1
  fi
}

function backup_database() {
  BACKUP_FILE="backup-$DB_NAME-$(date +%Y%m%d%H%M%S).sql"
  echo "Veritabanı yedekleniyor: $BACKUP_FILE"
  
  mysqldump -h$DB_HOST -u$DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_FILE
  
  if [ $? -eq 0 ]; then
    echo "Veritabanı başarıyla yedeklendi: $BACKUP_FILE"
  else
    echo "Veritabanı yedeklenirken bir hata oluştu."
    exit 1
  fi
}

function restore_database() {
  BACKUP_FILE=$1
  
  if [ -z "$BACKUP_FILE" ]; then
    echo "Geri yükleme için bir yedek dosyası belirtilmedi."
    exit 1
  fi
  
  if [ ! -f "$BACKUP_FILE" ]; then
    echo "Belirtilen yedek dosyası bulunamadı: $BACKUP_FILE"
    exit 1
  fi
  
  echo "Veritabanı geri yükleniyor: $BACKUP_FILE"
  
  mysql -h$DB_HOST -u$DB_USER -p$DB_PASSWORD $DB_NAME < $BACKUP_FILE
  
  if [ $? -eq 0 ]; then
    echo "Veritabanı başarıyla geri yüklendi."
  else
    echo "Veritabanı geri yüklenirken bir hata oluştu."
    exit 1
  fi
}

function drop_database() {
  echo -n "UYARI: $DB_NAME veritabanını tamamen silmek istediğinize emin misiniz? (evet/hayır): "
  read confirmation
  
  if [ "$confirmation" != "evet" ]; then
    echo "Veritabanı silme işlemi iptal edildi."
    exit 0
  fi
  
  echo "Veritabanı siliniyor: $DB_NAME"
  
  mysql -h$DB_HOST -u$DB_USER -p$DB_PASSWORD -e "DROP DATABASE IF EXISTS $DB_NAME;"
  
  if [ $? -eq 0 ]; then
    echo "Veritabanı başarıyla silindi."
  else
    echo "Veritabanı silinirken bir hata oluştu."
    exit 1
  fi
}

# Komut işleme
case "$command" in
  init)
    init_database
    ;;
  migrate)
    migrate_database
    ;;
  seed)
    seed_database
    ;;
  backup)
    backup_database
    ;;
  restore)
    restore_database "$1"
    ;;
  drop)
    drop_database
    ;;
  help|*)
    show_usage
    ;;
esac
