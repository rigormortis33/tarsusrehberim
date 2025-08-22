# Tarsus Rehberim - MySQL Kurulumu

Bu belge, Tarsus Rehberim uygulamasının MySQL veritabanı kurulumu için gerekli adımları içermektedir.

## Gereksinimler

- MySQL 5.7 veya daha yeni bir sürüm
- Node.js 16 veya daha yeni bir sürüm
- npm 7 veya daha yeni bir sürüm

## Çevre Değişkenleri

Aşağıdaki çevre değişkenlerini ayarlayabilirsiniz. Ayarlanmadığı takdirde varsayılan değerler kullanılacaktır:

```
DB_HOST=localhost
DB_USER=u588148465_panel
DB_PASSWORD=Emreninyalanlari33_*
DB_NAME=u588148465_terasus
```

## Veritabanı Kurulumu

### 1. Veritabanını oluşturma

Aşağıdaki komut ile MySQL veritabanını oluşturabilirsiniz:

```bash
npm run mysql:init
```

Bu komut, yukarıda belirtilen çevre değişkenlerine göre veritabanını oluşturacaktır. Eğer veritabanı zaten varsa, herhangi bir değişiklik yapılmayacaktır.

### 2. Tabloları oluşturma

Veritabanı şemasını oluşturmak için aşağıdaki komutu çalıştırın:

```bash
npm run mysql:migrate
```

Bu komut, `shared/mysql-schema.ts` dosyasında tanımlanan tabloları oluşturacaktır.

### 3. Örnek verileri ekleme

Örnek verilerle veritabanını doldurmak için aşağıdaki komutu çalıştırın:

```bash
npm run mysql:seed
```

Bu komut, veritabanına örnek kullanıcılar, işletmeler, otobüs güzergahları, acil durum numaraları vb. ekleyecektir.

### Tek Komutla Kurulum

Veritabanı oluşturma, tablo yapısını kurma ve örnek verileri ekleme işlemlerini tek bir komutla gerçekleştirmek için:

```bash
npm run mysql:setup
```

## Veritabanı Yönetimi

### Veritabanı Yedekleme

Veritabanını yedeklemek için:

```bash
npm run mysql:backup
```

Bu komut, `backup-{veritabani_adi}-{tarih}.sql` formatında bir yedek dosyası oluşturacaktır.

### Veritabanını Geri Yükleme

Bir yedeği geri yüklemek için:

```bash
bash scripts/db-mysql.sh restore <yedek_dosyasi.sql>
```

### Veritabanını Silme

**DİKKAT:** Bu işlem geri alınamaz!

```bash
bash scripts/db-mysql.sh drop
```

## MySQL Yapılandırması

MySQL bağlantı ayarları `server/MySQLStorage.ts` dosyasında tanımlanmıştır. Değişiklik yapmak için bu dosyayı düzenleyebilirsiniz.

## Tablolar ve İlişkiler

Veritabanı aşağıdaki tabloları içermektedir:

1. `users` - Kullanıcı hesapları
2. `businesses` - İşletme bilgileri
3. `bus_routes` - Otobüs güzergahları
4. `emergency_contacts` - Acil durum telefon numaraları
5. `announcements` - Duyurular
6. `outages` - Su ve elektrik kesintileri
7. `community_posts` - Topluluk gönderileri

İlişkisel yapı:
- `community_posts.author_id` -> `users.id` (Yabancı anahtar)

## Veri Yapısı

### Users (Kullanıcılar)
- `id`: VARCHAR(36) - Birincil anahtar
- `username`: VARCHAR(255) - Benzersiz kullanıcı adı
- `email`: VARCHAR(255) - Benzersiz e-posta adresi
- `password`: VARCHAR(255) - Şifrelenmiş parola
- `name`: VARCHAR(255) - Tam ad
- `phone`: VARCHAR(20) - Telefon numarası (isteğe bağlı)
- `location`: VARCHAR(255) - Konum bilgisi (isteğe bağlı)
- `created_at`: TIMESTAMP - Oluşturulma zamanı

### Businesses (İşletmeler)
- `id`: VARCHAR(36) - Birincil anahtar
- `name`: VARCHAR(255) - İşletme adı
- `category`: VARCHAR(100) - İşletme kategorisi
- `description`: TEXT - İşletme açıklaması
- `address`: VARCHAR(255) - İşletme adresi
- `phone`: VARCHAR(20) - İşletme telefon numarası
- `email`: VARCHAR(255) - Benzersiz e-posta adresi
- `password`: VARCHAR(255) - Şifrelenmiş parola
- `contact_person`: VARCHAR(255) - İletişim kurulacak kişi
- `rating`: INT - Puanlama
- `review_count`: INT - Değerlendirme sayısı
- `image_url`: TEXT - Profil görseli URL'si
- `is_premium`: BOOLEAN - Premium üyelik durumu
- `created_at`: TIMESTAMP - Oluşturulma zamanı

### Bus Routes (Otobüs Güzergahları)
- `id`: VARCHAR(36) - Birincil anahtar
- `route_number`: VARCHAR(50) - Güzergah numarası
- `route_name`: VARCHAR(255) - Güzergah adı
- `start_location`: VARCHAR(255) - Başlangıç noktası
- `end_location`: VARCHAR(255) - Bitiş noktası
- `estimated_time`: INT - Tahmini süre (dakika)
- `is_active`: BOOLEAN - Aktif durumu

### Emergency Contacts (Acil Durum Numaraları)
- `id`: VARCHAR(36) - Birincil anahtar
- `name`: VARCHAR(255) - Kurum/hizmet adı
- `category`: VARCHAR(100) - Kategori
- `phone`: VARCHAR(20) - Telefon numarası
- `description`: TEXT - Açıklama
- `is_available_247`: BOOLEAN - 24/7 hizmet durumu

### Announcements (Duyurular)
- `id`: VARCHAR(36) - Birincil anahtar
- `title`: VARCHAR(255) - Başlık
- `content`: TEXT - İçerik
- `category`: VARCHAR(100) - Kategori
- `is_urgent`: BOOLEAN - Acil durum
- `created_at`: TIMESTAMP - Oluşturulma zamanı

### Outages (Kesintiler)
- `id`: VARCHAR(36) - Birincil anahtar
- `type`: VARCHAR(50) - Tür ('water' veya 'electricity')
- `title`: VARCHAR(255) - Başlık
- `description`: TEXT - Açıklama
- `start_date`: TIMESTAMP - Başlangıç tarihi
- `end_date`: TIMESTAMP - Bitiş tarihi
- `affected_areas`: JSON - Etkilenen bölgeler (dizi)
- `is_active`: BOOLEAN - Aktif durumu
- `source`: VARCHAR(100) - Kaynak ('meski', 'toroslar-edas', vb.)
- `external_id`: VARCHAR(100) - Dış kaynak ID'si
- `created_at`: TIMESTAMP - Oluşturulma zamanı
- `updated_at`: TIMESTAMP - Güncellenme zamanı

### Community Posts (Topluluk Gönderileri)
- `id`: VARCHAR(36) - Birincil anahtar
- `author_id`: VARCHAR(36) - Yazar ID'si (users tablosu ile ilişkili)
- `title`: VARCHAR(255) - Başlık (isteğe bağlı)
- `content`: TEXT - İçerik
- `neighborhood`: VARCHAR(100) - Mahalle bilgisi (isteğe bağlı)
- `likes`: INT - Beğeni sayısı
- `comments`: INT - Yorum sayısı
- `created_at`: TIMESTAMP - Oluşturulma zamanı
