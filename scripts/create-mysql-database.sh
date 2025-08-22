#!/bin/bash

# MySQL veritabanı bilgileri
DB_HOST=${DB_HOST:-"srv1787.hstgr.io"}
DB_USER=${DB_USER:-"u588148465_terasus"}
DB_PASSWORD=${DB_PASSWORD:-"Emreninyalanlari33_*"}
DB_NAME=${DB_NAME:-"u588148465_panel"}
DB_PORT=${DB_PORT:-"3306"}

# MySQL kullanıcı adı ve şifrenin kontrol edilmesi
if [ -z "$DB_USER" ]; then
  echo "MySQL kullanıcı adı belirtilmedi. Lütfen DB_USER çevre değişkeni ile kullanıcı adı belirleyin."
  exit 1
fi

# Veritabanı oluştur
echo "Veritabanı oluşturuluyor: $DB_NAME"
mysql -h$DB_HOST -u$DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if [ $? -eq 0 ]; then
  echo "Veritabanı başarıyla oluşturuldu: $DB_NAME"
else
  echo "Veritabanı oluşturulurken bir hata oluştu."
  exit 1
fi

echo "MySQL veritabanı kurulumu tamamlandı."
