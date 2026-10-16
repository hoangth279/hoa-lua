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

-- Source: migrations/004_add_instagram_contact.sql
INSERT INTO site_settings (setting_key, setting_value, setting_group) VALUES
('instagram_url', 'https://www.instagram.com/hoalua.hoaloisong', 'social')
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  setting_group = VALUES(setting_group);

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

-- Story content is initialized by migrations/008_split_story_posts.sql.

-- Source: migrations/005_update_workshops_content.sql
ALTER TABLE workshops
  ADD COLUMN category VARCHAR(120) NULL AFTER description;

DELETE FROM bookings WHERE workshop_id IN (
  SELECT id FROM (
    SELECT id FROM workshops WHERE slug IN ('ve-lua-cung-mau-tu-nhien', 'nhuom-lua-tu-cay-co', 'ke-chuyen-tren-lua')
  ) AS old_workshops
);

DELETE FROM workshops WHERE slug IN ('ve-lua-cung-mau-tu-nhien', 'nhuom-lua-tu-cay-co', 'ke-chuyen-tren-lua');

INSERT INTO workshops (slug, title, excerpt, description, category, location, starts_at, ends_at, capacity, price, is_published) VALUES
('ghep-lua-vun-det-tranh-di-san', 'Ghép lụa vụn – Dệt tranh di sản', 'Cùng khám phá nét đẹp chất liệu qua việc tỉ mẩn lựa chọn, kết hợp từng mảnh lụa vụn Vụn Art để tự tay ghép nên một bức tranh lụa hoàn chỉnh. Workshop là không gian mở để bạn thả lỏng tâm trí, lắng nghe câu chuyện di sản và cảm nhận sự tỉ mỉ của nghệ thuật thủ công.', NULL, 'Trải nghiệm cộng đồng', 'Sảnh C, Trường Đại học Hà Nội', '2026-10-13 08:00:00', '2026-10-13 12:00:00', 40, 0, TRUE),
('trai-nghiem-art-kit-tu-tay-hoan-thien-san-pham-lua', 'Trải nghiệm Art Kit – Tự tay hoàn thiện sản phẩm lụa', 'Trực tiếp trải nghiệm và tự tay hoàn thiện trọn vẹn một sản phẩm ứng dụng từ bộ Kit chế tác lụa độc bản của Họa Lụa. Hoạt động mang đến trải nghiệm sáng tạo bền vững, giúp bạn mang nghệ thuật lụa tái chế hòa cùng nhịp sống thường nhật.', NULL, 'Thực hành cá nhân', 'Sảnh C, Trường Đại học Hà Nội', '2026-10-13 08:00:00', '2026-10-13 12:00:00', 30, 0, TRUE)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  excerpt = VALUES(excerpt),
  category = VALUES(category),
  location = VALUES(location),
  starts_at = VALUES(starts_at),
  ends_at = VALUES(ends_at),
  capacity = VALUES(capacity),
  price = VALUES(price),
  is_published = VALUES(is_published);

-- Source: migrations/006_move_public_campaigns_to_db.sql
-- Move the activities previously embedded in the frontend into editable DB records.
-- Only insert missing slugs; preserve any content already edited by an admin.
INSERT INTO campaigns (slug, title, excerpt, content, display_order, is_published)
VALUES ('nhung-manh-lua-ghep', 'Những mảnh lụa ghép',
  'Khám phá câu chuyện chất liệu và sự tỉ mẩn từ đôi tay thợ thủ công.',
  'Chuỗi trò chuyện (talkshow) giúp mọi người hiểu thêm về kỹ thuật cắt tỉa cũng như về chất liệu thủ công bản địa. Hoạt động tôn vinh nét đẹp chất liệu lụa truyền thống, giúp cộng đồng lắng nghe câu chuyện thương hiệu VỤN Art và cảm nhận sâu sắc cái "tâm", sự tỉ mỉ trong từng mảnh lụa của nghệ nhân.',
  1, TRUE)
ON DUPLICATE KEY UPDATE slug = VALUES(slug);

INSERT INTO campaigns (slug, title, excerpt, content, display_order, is_published)
VALUES ('ban-tay-nghe-nhan', 'Bàn tay nghệ nhân',
  'Nghệ thuật tái sinh lụa vụn – Đưa lối sống xanh hòa vào nhịp sống phố thị.',
  'Đưa các tác phẩm lụa tái chế (sản phẩm của Vụn Art) vào những không gian quen thuộc như góc phố, quán xá đời thường. Hoạt động lan tỏa thẩm mỹ lụa ghép nghệ thuật và cảm hứng sống xanh bền vững, chứng minh rằng chất liệu thừa hoàn toàn có thể "tái sinh" thành một phần đẹp đẽ trong cuộc sống thường nhật.',
  2, TRUE)
ON DUPLICATE KEY UPDATE slug = VALUES(slug);

INSERT INTO campaigns (slug, title, excerpt, content, display_order, is_published)
VALUES ('dau-an-hoai-niem', 'Dấu ấn hoài niệm',
  'Góp một mảnh ký ức – Dệt nên câu chuyện thanh xuân cùng cộng đồng.',
  'Mời cộng đồng trẻ cùng tham gia đóng góp những mảnh lụa vụn và mảnh ký ức cá nhân để tạo nên một tác phẩm lụa nối dài được trưng bày lưu động. Hoạt động tạo ra không gian mở để người trẻ gặp gỡ, sẻ chia và lưu dấu những khoảnh khắc thanh xuân đồng hành cùng di sản lụa Việt.',
  3, TRUE)
ON DUPLICATE KEY UPDATE slug = VALUES(slug);

-- Source: migrations/008_split_story_posts.sql
-- Split the former singleton Story post into three independent posts.
-- Preserve existing section edits and remove only the obsolete singleton.
SET @hoa_lua_story_content = (SELECT content FROM posts WHERE slug = 'cau-chuyen-hoa-lua' AND JSON_VALID(content) = 1 LIMIT 1);
SET @hoa_lua_story_published = (SELECT is_published FROM posts WHERE slug = 'cau-chuyen-hoa-lua' LIMIT 1);

INSERT INTO posts (slug, title, excerpt, content, category, is_published, published_at)
VALUES ('luu-giu-di-san-van-hoa-viet',
COALESCE(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].title')), 'null'), 'Lưu giữ dòng chảy di sản & nét đẹp Văn hóa Việt'),
'Lụa không chỉ là một chất liệu thủ công, mà là gạch nối lưu giữ lịch sử và bản sắc văn hóa Việt qua hàng thế kỷ.',
COALESCE(NULLIF(CONCAT_WS(CHAR(10,10),
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[0].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[0].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[0].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[0].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[1].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[1].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[1].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[1].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[2].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[2].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[2].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[2].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[3].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[3].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[3].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[3].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[4].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[4].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[4].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[4].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[5].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[5].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[5].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[5].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[6].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[6].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[6].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[6].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[7].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[7].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[7].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[7].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[8].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[8].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[8].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[8].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[9].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[9].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[9].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[9].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[10].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[10].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[10].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[10].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[11].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[11].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[11].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[0].points[11].text'))) END), ''), CONCAT('Chiều sâu di sản: Lụa không chỉ là một chất liệu thủ công, mà là gạch nối lưu giữ lịch sử và bản sắc văn hóa Việt qua hàng thế kỷ.', CHAR(10,10), 'Hơi thở làng nghề: Từ những cuộn lụa ươm tơ truyền thống Vạn Phúc đến từng mảnh lụa vụn, tất cả đều chứa đựng vệt màu thời gian, tình yêu nghề và nhịp đập di sản nghìn năm.')),
'Câu chuyện', COALESCE(@hoa_lua_story_published, 1), IF(COALESCE(@hoa_lua_story_published, 1) = 1, NOW(), NULL))
ON DUPLICATE KEY UPDATE slug = VALUES(slug);

INSERT INTO posts (slug, title, excerpt, content, category, is_published, published_at)
VALUES ('luu-giu-nghe-nhan-song-xanh',
COALESCE(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].title')), 'null'), 'Lưu giữ đôi tay nghệ nhân & tinh thần Sống Xanh bền vững'),
'Đồng hành cùng Vụn Art, Họa Lụa nhìn thấy ở những mảnh lụa thừa không phải rác thải, mà là một vòng đời mới đầy tiềm năng.',
COALESCE(NULLIF(CONCAT_WS(CHAR(10,10),
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[0].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[0].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[0].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[0].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[1].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[1].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[1].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[1].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[2].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[2].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[2].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[2].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[3].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[3].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[3].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[3].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[4].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[4].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[4].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[4].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[5].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[5].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[5].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[5].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[6].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[6].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[6].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[6].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[7].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[7].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[7].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[7].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[8].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[8].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[8].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[8].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[9].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[9].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[9].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[9].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[10].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[10].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[10].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[10].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[11].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[11].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[11].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[1].points[11].text'))) END), ''), CONCAT('Nghệ thuật tái sinh chất liệu: Đồng hành cùng Vụn Art, Họa Lụa nhìn thấy ở những mảnh lụa thừa không phải rác thải, mà là một vòng đời mới đầy tiềm năng.', CHAR(10,10), 'Bàn tay kiên nhẫn: Qua sự tỉ mỉ của những "người thợ đặc biệt", từng mảnh vụn được chọn lọc, cắt ghép để trở thành các bức tranh ghép lụa hay sản phẩm ứng dụng có hồn.', CHAR(10,10), 'Giá trị nhân văn: Ở đó, sống xanh không nằm ở lý thuyết xa xôi, mà hiện hữu trong sinh kế bền vững, sự trân trọng tài nguyên và tình người gửi gắm qua từng nếp vải.')),
'Câu chuyện', COALESCE(@hoa_lua_story_published, 1), IF(COALESCE(@hoa_lua_story_published, 1) = 1, NOW(), NULL))
ON DUPLICATE KEY UPDATE slug = VALUES(slug);

INSERT INTO posts (slug, title, excerpt, content, category, is_published, published_at)
VALUES ('luu-giu-ket-noi-the-he-tre',
COALESCE(NULLIF(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].title')), 'null'), 'Lưu giữ sự kết nối & tiếp nối cùng thế hệ trẻ (Gen Z)'),
'Họa Lụa không cố đóng khung truyền thống trong không gian bảo tàng hay quá khứ.',
COALESCE(NULLIF(CONCAT_WS(CHAR(10,10),
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[0].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[0].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[0].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[0].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[1].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[1].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[1].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[1].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[2].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[2].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[2].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[2].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[3].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[3].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[3].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[3].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[4].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[4].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[4].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[4].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[5].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[5].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[5].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[5].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[6].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[6].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[6].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[6].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[7].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[7].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[7].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[7].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[8].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[8].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[8].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[8].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[9].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[9].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[9].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[9].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[10].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[10].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[10].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[10].text'))) END,
CASE WHEN JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[11].label')) = 'STRING' AND JSON_TYPE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[11].text')) = 'STRING' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[11].label')), ': ', JSON_UNQUOTE(JSON_EXTRACT(@hoa_lua_story_content, '$.pillars.items[2].points[11].text'))) END), ''), CONCAT('Đưa di sản vào đời sống: Họa Lụa không cố đóng khung truyền thống trong không gian bảo tàng hay quá khứ.', CHAR(10,10), 'Không gian giao thoa: Chúng tôi tạo điều kiện để nghệ nhân, nghệ sĩ và thế hệ trẻ gặp gỡ, sẻ chia và cùng thực hành sáng tạo.', CHAR(10,10), 'Sức sống mới của lụa: Nhờ đó, lụa tiếp tục chuyển động — trở nên tử tế, bền vững, gần gũi hơn với nhịp sống hôm nay và tự hào đồng hành cùng người trẻ.')),
'Câu chuyện', COALESCE(@hoa_lua_story_published, 1), IF(COALESCE(@hoa_lua_story_published, 1) = 1, NOW(), NULL))
ON DUPLICATE KEY UPDATE slug = VALUES(slug);

DELETE FROM posts WHERE slug = 'cau-chuyen-hoa-lua';
SET @hoa_lua_story_content = NULL;
SET @hoa_lua_story_published = NULL;
