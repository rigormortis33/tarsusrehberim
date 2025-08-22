# Uzak MySQL Veritabanı Bağlantısı

## Bağlantı Bilgileri
- **Host/Sunucu**: srv1787.hstgr.io (veya IP: 193.203.168.172)
- **Port**: 3306 (MySQL varsayılan portu)
- **Kullanıcı adı**: u588148465_terasus
- **Şifre**: Emreninyalanlari33_*
- **Veritabanı**: u588148465_panel
- **İzin verilen IP**: 188.119.43.56

## Kurulum Adımları

### 1. Hosting Kontrol Panelinden Ayarlar

Uzak MySQL veritabanına bağlantı kurmak için önce hosting kontrol panelinizde şu ayarları yapmanız gerekmektedir:

1. MySQL kullanıcıları bölümüne gidin
2. `u588148465_panel` kullanıcısının yetkilerini şu şekilde ayarlayın:
   - Veritabanı: `u588148465_tarsusgo` (veya `*` ile tüm veritabanları)
   - İzinler: SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP, CREATE TEMPORARY TABLES
   - Erişim izni verilen IP: 188.119.43.56 (veya herhangi)

### 2. Veritabanı Oluşturma ve Tabloları Kurma

Veritabanını ve tabloları oluşturmak için şu komutu çalıştırın:

```bash
./scripts/setup-remote-db.sh
```

Bu script:
- Uzak sunucuda bağlantı kurar
- Veritabanını oluşturur (eğer yoksa)
- Tüm gerekli tabloları oluşturur

### 3. Örnek Verileri Ekleme

Veritabanını örnek verilerle doldurmak için:

```bash
npm run mysql:seed
```

### 4. Bağlantı Testi

Bağlantıyı test etmek için:

```bash
mysql -h srv1787.hstgr.io -u u588148465_panel -p -e "SHOW TABLES FROM u588148465_tarsusgo;"
```

Bu komut şifre soracaktır, güvenlik nedeniyle şifreyi komut satırında açık olarak yazmaktan kaçının.

## Bağlantı Sorunları

- **Erişim Reddedildi (Access Denied)**: Kullanıcı adı, şifre veya IP izni sorunlarını kontrol edin
- **Bağlantı Zaman Aşımı (Connection Timeout)**: Sunucu erişilebilirliği veya güvenlik duvarı ayarlarını kontrol edin
- **Tablo Bulunamadı (Table Not Found)**: Veritabanı ve tablo adlarının doğru olduğundan emin olun

## Uygulama Yapılandırması

Uygulamanın uzak veritabanına bağlanması için `.env` dosyasında şu ayarlar tanımlanmıştır:

```
DB_HOST=srv1787.hstgr.io
DB_PORT=3306
DB_USER=u588148465_terasus
DB_PASSWORD=Emreninyalanlari33_*
DB_NAME=u588148465_panel
```

Bu ayarlar MySQLStorage.ts içinde kullanılmakta ve bağlantı bu bilgiler üzerinden yapılmaktadır.
