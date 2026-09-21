-- Họa Lụa production schema for Hostinger/phpMyAdmin
-- Select the target database before importing this file.

-- Source: migrations/001_initial_schema.sql
CREATE TABLE IF NOT EXISTS campaigns (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(180) NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content LONGTEXT NULL,
  status VARCHAR(80) NOT NULL DEFAULT 'upcoming',
  start_date DATE NULL,
  end_date DATE NULL,
  cover_image VARCHAR(500) NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_campaigns_slug (slug),
  KEY idx_campaigns_public_order (is_published, display_order, start_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS workshops (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(180) NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  description LONGTEXT NULL,
  location VARCHAR(255) NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  capacity SMALLINT UNSIGNED NOT NULL,
  price DECIMAL(12,2) UNSIGNED NOT NULL DEFAULT 0,
  cover_image VARCHAR(500) NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_workshops_slug (slug),
  KEY idx_workshops_public_date (is_published, starts_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  workshop_id BIGINT UNSIGNED NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  participants TINYINT UNSIGNED NOT NULL DEFAULT 1,
  note TEXT NULL,
  status ENUM('pending','confirmed','cancelled','attended') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_workshop FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  KEY idx_bookings_workshop_status (workshop_id, status),
  KEY idx_bookings_email (email),
  KEY idx_bookings_created_at (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  subject VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new','in_progress','resolved','spam') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_contact_status_created (status, created_at),
  KEY idx_contact_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS posts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(180) NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content LONGTEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  cover_image VARCHAR(500) NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_posts_slug (slug),
  KEY idx_posts_public_date (is_published, published_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS gallery_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  media_type ENUM('image','video') NOT NULL DEFAULT 'image',
  media_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500) NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_gallery_public_order (is_published, display_order, created_at)
) ENGINE=InnoDB;

-- Source: migrations/002_admin_management.sql
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin','editor') NOT NULL DEFAULT 'editor',
  status ENUM('active','disabled') NOT NULL DEFAULT 'active',
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admin_users_email (email),
  KEY idx_admin_users_status_role (status, role)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS site_settings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(120) NOT NULL,
  setting_value TEXT NULL,
  setting_group VARCHAR(80) NOT NULL DEFAULT 'general',
  updated_by BIGINT UNSIGNED NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_site_settings_key (setting_key),
  CONSTRAINT fk_site_settings_admin FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  KEY idx_site_settings_group (setting_group)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_user_id BIGINT UNSIGNED NULL,
  action VARCHAR(80) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  payload JSON NULL,
  ip_address VARCHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_logs_admin FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  KEY idx_audit_entity (entity_type, entity_id),
  KEY idx_audit_admin_date (admin_user_id, created_at),
  KEY idx_audit_created_at (created_at)
) ENGINE=InnoDB;

INSERT INTO site_settings (setting_key, setting_value, setting_group) VALUES
('site_name', 'Họa Lụa', 'general'),
('contact_email', 'xinchao@hoalua.vn', 'contact'),
('contact_phone', '', 'contact'),
('facebook_url', 'https://facebook.com', 'social'),
('instagram_url', 'https://instagram.com', 'social'),
('youtube_url', 'https://youtube.com', 'social'),
('seo_description', 'Họa Lụa kết nối lụa, thủ công và văn hóa Việt với đời sống đương đại.', 'seo')
ON DUPLICATE KEY UPDATE setting_key = VALUES(setting_key);

-- Source: migrations/003_update_contact_channels.sql
INSERT INTO site_settings (setting_key, setting_value, setting_group) VALUES
('contact_email', 'hoalua.story@gmail.com', 'contact'),
('contact_phone', '0989.170.149', 'contact'),
('contact_address', 'Km 9, Đường Nguyễn Trãi, Phường Đại Mỗ, Thành phố Hà Nội, Việt Nam', 'contact'),
('facebook_url', 'https://www.facebook.com/profile.php?id=61594504626803', 'social'),
('tiktok_url', 'https://www.tiktok.com/@hoaluastory', 'social')
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  setting_group = VALUES(setting_group);

DELETE FROM site_settings
WHERE setting_key IN ('instagram_url', 'youtube_url');

-- Source: seeds/001_demo_content.sql
INSERT INTO campaigns (slug,title,excerpt,content,status,start_date,end_date,display_order,is_published) VALUES
('mot-met-lua-mot-cau-chuyen','Một mét lụa, một câu chuyện','Mời cộng đồng góp một mảnh ký ức để cùng tạo nên tác phẩm lụa dài.','Tác phẩm cộng đồng được trưng bày lưu động và tiếp tục lớn lên sau mỗi điểm dừng.','Đang diễn ra','2026-09-01','2026-12-31',1,TRUE),
('sac-viet-tu-cay-co','Sắc Việt từ cây cỏ','Chuỗi trò chuyện và thực hành về màu nhuộm bản địa.','Gặp gỡ nghệ nhân và thực hành chiết màu bền vững từ nguyên liệu tự nhiên.','Tháng 10.2026','2026-10-01','2026-10-31',2,TRUE),
('lua-di-qua-pho','Lụa đi qua phố','Đưa tác phẩm lụa vào những không gian quen thuộc.','Một triển lãm lưu động để nghệ thuật trở thành một phần của đời sống.','Sắp diễn ra','2026-11-01','2027-01-31',3,TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title),excerpt=VALUES(excerpt),status=VALUES(status),is_published=VALUES(is_published);

INSERT INTO workshops (id,slug,title,excerpt,description,location,starts_at,ends_at,capacity,price,is_published) VALUES
(1,'ve-lua-cung-mau-tu-nhien','Vẽ lụa cùng màu tự nhiên','Khám phá độ thấm, độ loang và hoàn thiện một bức lụa nhỏ.','Workshop nhập môn, đã bao gồm toàn bộ vật liệu.','Nhà Văn hóa Nghệ thuật, TP.HCM','2026-10-18 09:00:00','2026-10-18 12:00:00',16,0,TRUE),
(2,'nhuom-lua-tu-cay-co','Nhuộm lụa từ cây cỏ','Học cách chiết màu và tạo hoa văn độc bản.','Thực hành nhuộm bằng lá và vỏ cây bản địa.','Xưởng Họa Lụa, TP.HCM','2026-10-25 14:00:00','2026-10-25 17:00:00',12,250000,TRUE),
(3,'ke-chuyen-tren-lua','Kể chuyện trên lụa','Một buổi sáng cho gia đình cùng phác họa ký ức.','Hoạt động dành cho trẻ từ 7 tuổi đi cùng người lớn.','Thư viện Khoa học Tổng hợp, TP.HCM','2026-11-01 09:00:00','2026-11-01 11:30:00',20,0,TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title),starts_at=VALUES(starts_at),ends_at=VALUES(ends_at),capacity=VALUES(capacity),price=VALUES(price),is_published=VALUES(is_published);

INSERT INTO posts (slug,title,excerpt,content,category,is_published,published_at) VALUES
('lua-trong-doi-song-duong-dai','Lụa trong đời sống đương đại: mềm mại nhưng không mong manh','Khi chất liệu truyền thống bước ra khỏi khung tranh và trở thành một cuộc đối thoại mới.','Lụa đang tìm thấy những hình thức mới trong nghệ thuật, thiết kế và giáo dục cộng đồng.','Câu chuyện',TRUE,'2026-09-12 08:00:00'),
('gap-go-nghe-nhan-mau-tu-nhien','Gặp người giữ màu từ lá, vỏ cây và đất','Một buổi trò chuyện về sự kiên nhẫn, ký ức và những gam màu không bao giờ lặp lại.','Mỗi mẻ màu tự nhiên là kết quả của mùa, đất, nước và kinh nghiệm người làm nghề.','Chân dung',TRUE,'2026-09-05 08:00:00'),
('nhat-ky-workshop-dau-tien','Những nét cọ đầu tiên trên lụa','Nhìn lại buổi gặp gỡ nơi mỗi người mang về một tác phẩm.','Không có hai bức lụa giống nhau, cũng như không có hai câu chuyện giống nhau.','Nhật ký',TRUE,'2026-08-28 08:00:00')
ON DUPLICATE KEY UPDATE title=VALUES(title),excerpt=VALUES(excerpt),content=VALUES(content),category=VALUES(category),is_published=VALUES(is_published),published_at=VALUES(published_at);
