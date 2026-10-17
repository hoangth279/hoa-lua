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

-- Source: migrations/009_add_articles.sql
CREATE TABLE IF NOT EXISTS articles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(180) NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content LONGTEXT NOT NULL,
  steps_json LONGTEXT NULL,
  cover_image VARCHAR(500) NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  published_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_articles_slug (slug),
  KEY idx_articles_public_order (is_published, display_order)
) ENGINE=InnoDB;

INSERT INTO articles (slug, title, excerpt, content, steps_json, cover_image, display_order, is_published, published_at) VALUES
('tranh-thu-cong-lam-tu-lua', 'Tranh thủ công làm từ lụa: Nghệ thuật ghép lụa VỤN Art',
'Khám phá cách những mảnh lụa Vạn Phúc trở thành tranh thủ công độc đáo tại VỤN Art và tài nghệ ẩn sau từng chi tiết ghép lụa.',
'Tranh thủ công làm từ lụa: Khi từng mảnh nhỏ trở thành một tác phẩm\n\nThoạt nhìn, một mảnh lụa nhỏ có thể chỉ là phần vật liệu còn lại sau quá trình sản xuất. Nhưng khi đi qua đôi bàn tay của người nghệ nhân, những mảnh lụa ấy có thể trở thành một phần của bức tranh đầy màu sắc.\n\nTranh thủ công làm từ lụa vì thế không chỉ gây ấn tượng bởi chất liệu đặc biệt, mà còn bởi sự kiên nhẫn, độ chính xác và cảm quan thẩm mỹ được đặt vào từng chi tiết.\n\nTại VỤN Art, những mảnh lụa Vạn Phúc được đưa vào một hành trình mới: từ vật liệu nhỏ bé trở thành những tác phẩm nghệ thuật ghép lụa mang dấu ấn riêng.\n\nTranh thủ công làm từ lụa là gì?\n\nTranh thủ công làm từ lụa là một hình thức sáng tạo sử dụng lụa làm vật liệu tạo hình. Thay vì dùng màu vẽ để tạo nên toàn bộ hình ảnh, người làm tranh lựa chọn, cắt và kết hợp những mảnh lụa có màu sắc, hoa văn và sắc độ khác nhau để tạo thành bố cục hoàn chỉnh.\n\nChính đặc tính mềm, có độ bóng và nhiều hoa văn của lụa khiến mỗi mảnh vật liệu có thể tạo ra một hiệu ứng thị giác khác nhau.\n\nMột chi tiết rất nhỏ trên bức tranh đôi khi cũng cần được cân nhắc về màu sắc, hình dáng và vị trí trước khi được ghép vào tổng thể.\n\nĐó là lý do một bức tranh ghép lụa vụn không chỉ đơn giản là việc đặt những mảnh vải cạnh nhau. Đằng sau nó là rất nhiều lựa chọn mang tính nghệ thuật.\n\nTừ lụa Vạn Phúc đến một tác phẩm mới\n\nMột trong những chất liệu gắn với câu chuyện của VỤN Art là lụa Vạn Phúc.\n\nThay vì chỉ nhìn vào một mảnh lụa riêng lẻ, các nghệ nhân khai thác màu sắc, hoa văn và kết cấu của từng phần vật liệu để đưa chúng vào tác phẩm.\n\nKhi đứng riêng, một mảnh lụa có thể rất nhỏ.\n\nNhưng khi được đặt đúng vị trí, nó có thể trở thành một cánh hoa, một phần trang phục, một đường nét trên gương mặt hay một chi tiết làm nên toàn bộ bố cục của bức tranh.\n\nĐó cũng là điều thú vị của nghệ thuật ghép lụa: giá trị không nằm ở kích thước của từng mảnh vật liệu, mà ở cách người nghệ nhân nhìn thấy khả năng của chúng.\n\nĐiều gì làm nên sự tỉ mỉ của tranh ghép lụa?\n\nĐể một tác phẩm hoàn thiện, người làm tranh phải quan sát rất kỹ từng chi tiết.\n\nTừ việc lựa chọn sắc độ phù hợp, xử lý những đường cong nhỏ, cắt từng phần lụa đến sắp xếp và ghép các chi tiết lại với nhau, mỗi bước đều cần sự tập trung.\n\nĐặc biệt, lụa là chất liệu mềm nên chỉ một thay đổi nhỏ trong đường cắt hoặc vị trí đặt vật liệu cũng có thể ảnh hưởng đến hình ảnh cuối cùng.\n\nKhi nhìn một tác phẩm hoàn chỉnh, người xem dễ bị thu hút bởi màu sắc.\n\nNhưng nếu nhìn gần hơn, điều đáng chú ý lại nằm ở hàng loạt đường cắt, điểm ghép và lựa chọn rất nhỏ phía sau tác phẩm.\n\nGiá trị nằm ở đôi bàn tay phía sau tác phẩm\n\nTại VỤN Art, nhiều nghệ nhân tham gia sáng tạo là người khuyết tật.\n\nNhưng Họa Lụa không muốn kể câu chuyện của họ từ góc nhìn của sự thương cảm.\n\nĐiều chúng mình muốn mọi người nhìn thấy trước tiên là khả năng sáng tạo, sự kiên trì và tay nghề.\n\nMột bức tranh đẹp không được tạo nên chỉ bởi chất liệu đẹp.\n\nNó cần một người đủ tinh tế để nhìn ra mảnh lụa nào phù hợp, đủ khéo léo để xử lý từng chi tiết và đủ kiên nhẫn để hoàn thiện toàn bộ tác phẩm.\n\nĐó cũng là lý do Họa Lụa lựa chọn thông điệp: “Nâng niu tài nghệ trên từng mảnh lụa.”\n\nBởi phía sau từng mảnh lụa là một quyết định của người nghệ nhân.\n\nVà phía sau một tác phẩm hoàn chỉnh là rất nhiều giờ lao động sáng tạo mà người xem có thể không nhận ra nếu chỉ nhìn thành phẩm.\n\nChạm vào lụa để hiểu thêm về người làm ra nó\n\nBạn có thể nhìn thấy màu sắc của lụa trên màn hình, nhưng khi trực tiếp chạm vào chất liệu, quan sát những chi tiết nhỏ và tự thử ghép một tác phẩm, câu chuyện sẽ trở nên gần hơn.\n\nNếu bạn muốn tự mình trải nghiệm nghệ thuật ghép lụa, hãy khám phá Workshop Họa Lụa × VỤN Art và thử tạo nên tác phẩm của riêng mình.',
NULL, NULL, 1, TRUE, '2026-10-17 00:00:00'),
('qua-tang-lam-tu-lua', 'Quà tặng làm từ lụa: Gợi ý quà thủ công tinh tế và khác biệt',
'Tìm kiếm quà tặng làm từ lụa? Khám phá những gợi ý quà thủ công từ tranh, đồ trang trí đến phụ kiện mang dấu ấn nghệ thuật Việt.',
'Quà tặng làm từ lụa: Khi món quà kể được một câu chuyện\n\nMột món quà đáng nhớ đôi khi không cần có giá trị vật chất quá lớn. Điều khiến người nhận trân trọng và giữ gìn món quà lâu hơn có thể nằm ở câu chuyện phía sau, công sức của người làm và giá trị mà món quà ấy mang theo.\n\nĐó cũng là lý do quà tặng làm từ lụa mang một sức hấp dẫn rất riêng: mềm mại về chất liệu, nổi bật về hoa văn và có nhiều khả năng biến đổi thông qua bàn tay của người làm thủ công.\n\nVì sao quà tặng từ lụa có sức hút riêng?\n\nLụa vốn có màu sắc và bề mặt đặc biệt. Khi được đưa vào sản phẩm thủ công, từng họa tiết có thể tạo nên cảm giác khác nhau.\n\nNhưng điều làm những món quà này trở nên thú vị không chỉ nằm ở chất liệu.\n\nĐằng sau mỗi sản phẩm còn có sự lựa chọn, sắp xếp và hoàn thiện của người nghệ nhân.\n\nVì vậy, thay vì chỉ là một món đồ để sử dụng, quà thủ công từ lụa có thể trở thành một cách để người tặng chia sẻ một câu chuyện về văn hóa, nghệ thuật và tài nghệ của người làm ra sản phẩm.\n\nTranh ghép lụa – món quà dành cho người yêu nghệ thuật\n\nMột bức tranh ghép lụa có thể trở thành điểm nhấn cho bàn học, phòng ngủ hoặc không gian làm việc.\n\nĐiểm thú vị nằm ở việc người xem có thể quan sát rất nhiều lớp chi tiết khác nhau: màu sắc của lụa, đường cắt, cách các mảnh nhỏ được kết hợp và bố cục của toàn bộ tác phẩm.\n\nVới những người yêu nghệ thuật thủ công, đây là một món quà vừa mang tính trang trí vừa có câu chuyện để khám phá.\n\nLót cốc từ lụa – đưa nghệ thuật vào những khoảnh khắc nhỏ\n\nKhông phải lúc nào nghệ thuật cũng cần xuất hiện dưới dạng một bức tranh lớn.\n\nMột bộ lót cốc có chi tiết lụa có thể đưa chất liệu truyền thống vào những hoạt động rất quen thuộc như uống cà phê, học bài hay trang trí góc làm việc.\n\nĐây cũng là cách khiến nghệ thuật trở nên gần gũi hơn với lối sống của người trẻ.\n\nMóc khóa lụa – nhỏ nhưng mang dấu ấn cá nhân\n\nMột chiếc móc khóa là vật dụng đơn giản, nhưng khi có thêm họa tiết hoặc chi tiết thủ công từ lụa, nó có thể trở thành một món phụ kiện mang dấu ấn riêng.\n\nCó thể treo trên balo, túi xách hoặc chìa khóa, món quà này phù hợp với những người thích những chi tiết nhỏ nhưng khác biệt.\n\nTote bag với chi tiết lụa – kết hợp thủ công và phong cách hằng ngày\n\nTúi tote vốn đã rất quen thuộc với sinh viên.\n\nKhi được kết hợp thêm chi tiết lụa, một vật dụng thường ngày có thể trở thành điểm nhấn cho outfit.\n\nĐây cũng chính là cách Họa Lụa nhìn về nghệ thuật truyền thống: không nhất thiết phải đặt trong một không gian xa cách, mà hoàn toàn có thể xuất hiện trong đời sống của Gen Z.\n\nPhụ kiện và chi tiết trang trí từ lụa\n\nLụa cũng có thể xuất hiện trên những món phụ kiện hoặc chi tiết trang trí nhỏ.\n\nNhờ màu sắc và hoa văn đa dạng, mỗi cách kết hợp đều có thể tạo ra một cảm giác khác nhau.\n\nTùy từng thiết kế và bộ sưu tập, hình thức sản phẩm thực tế có thể thay đổi. Nhưng điểm chung vẫn nằm ở việc sử dụng chất liệu để tạo nên một sản phẩm có tính thẩm mỹ và dấu ấn thủ công.\n\nMột món quà sẽ ý nghĩa hơn khi bạn hiểu người làm ra nó\n\nKhi chọn quà lưu niệm lụa độc đáo hay một sản phẩm thủ công Việt Nam, chúng ta thường chú ý trước tiên đến hình dáng.\n\nNhưng thử nhìn gần hơn một chút.\n\nAi đã lựa chọn mảnh lụa này? Ai đã cắt từng đường nhỏ? Ai đã quyết định hai màu này nên nằm cạnh nhau?\n\nTại VỤN Art, những câu hỏi đó đưa người xem trở lại với người nghệ nhân – nơi giá trị thực sự của sản phẩm bắt đầu.\n\nVới Họa Lụa, điều đáng trân trọng không chỉ là việc một mảnh vật liệu được sử dụng theo cách mới, mà còn là tài nghệ giúp biến nó thành một thứ đáng giữ lại.\n\nNếu bạn muốn hiểu rõ hơn cách những sản phẩm ấy được tạo nên, hãy đọc “Tranh thủ công làm từ lụa: Khi từng mảnh nhỏ trở thành một tác phẩm” hoặc trực tiếp trải nghiệm nghệ thuật ghép lụa tại workshop của Họa Lụa.',
NULL, NULL, 2, TRUE, '2026-10-17 00:00:00'),
('cach-lam-tranh-lua-vun-tai-vun-art', 'Cách làm tranh lụa vụn tại VỤN Art: Từ ý tưởng đến tác phẩm',
'Khám phá cách làm tranh lụa vụn tại VỤN Art qua từng công đoạn: thiết kế, chọn vải, cắt chi tiết, ghép bố cục và hoàn thiện tác phẩm.',
'Khi nhìn vào một bức tranh ghép lụa hoàn chỉnh, chúng ta dễ bị thu hút bởi màu sắc, bố cục hay những chi tiết nhỏ được kết hợp hài hòa. Nhưng để những mảnh vải tưởng chừng rời rạc có thể trở thành một tác phẩm hoàn chỉnh, phía sau là cả một quá trình đòi hỏi sự tập trung, kiên nhẫn và khéo léo.\n\nVậy cách làm tranh lụa vụn tại VỤN Art diễn ra như thế nào?\n\nTừ việc hình thành ý tưởng, chuẩn bị vật liệu cho đến cắt, sắp xếp và cố định từng mảnh vải, mỗi công đoạn đều có vai trò riêng trong việc tạo nên một tác phẩm vừa chính xác về hình ảnh, vừa hài hòa về màu sắc.\n\nVới tinh thần “Chạm để thấy tài nghệ”, Họa Lụa mang đến cơ hội để người tham gia tự tay tiếp xúc với chất liệu, thử sức với nghệ thuật ghép lụa và hiểu thêm về câu chuyện phía sau những tác phẩm của VỤN Art.',
'[{"step":"01","title":"Thiết kế và chuyển thể ý tưởng","body":"Các nghệ nhân tại VỤN Art bắt đầu bằng việc phác thảo bản thiết kế, chuyển những ý tưởng sáng tạo thành hình ảnh với bố cục và mảng khối rõ ràng. Từng chi tiết trong bản vẽ được xác định kỹ lưỡng để đảm bảo sự hài hòa về màu sắc, hình dáng và bố cục.","image":"/articles/buoc-1.jpg"},{"step":"02","title":"In mẫu và cắt chi tiết","body":"Sau khi hoàn thiện bản thiết kế, nghệ nhân sẽ in mẫu ra giấy để tạo khuôn mẫu chuẩn xác cho từng chi tiết. Từng mảnh vải được cắt theo hình dáng và kích thước định sẵn, đảm bảo các chi tiết ghép lại với nhau hài hòa và cân đối, làm nền tảng cho toàn bộ bức tranh.","image":"/articles/buoc-2.jpg"},{"step":"03","title":"Chuẩn bị vải và nền","body":"VỤN Art lựa chọn loại vải phù hợp với chủ đề và màu sắc của bức tranh, chủ yếu sử dụng vải vụn và lụa vụn, nhằm tận dụng chất liệu tái chế nhưng vẫn tạo hiệu ứng thẩm mỹ cao. Vải được là phẳng, chuẩn bị sẵn trên tấm mex – một nền chắc chắn, giúp các mảnh vải khi gắn lên được ổn định và giữ hình dáng lâu dài.","image":"/articles/buoc-3.jpg"},{"step":"04","title":"Vẽ và cắt hình theo mẫu","body":"Trên mặt sau tấm mex, các nghệ nhân cẩn thận vẽ lại từng họa tiết theo bản thiết kế, đảm bảo từng chi tiết được định hình chính xác. Mỗi đường cắt được thực hiện tỉ mỉ, tập trung cao độ, tạo ra những hình khối cân đối, vừa vặn, giúp bức tranh khi ghép các mảnh vải trở nên sống động và hài hòa.","image":"/articles/buoc-4.jpg"},{"step":"05","title":"Gắn kết và hoàn thiện","body":"Từng mảnh vải được xếp và điều chỉnh trên nền theo bố cục thiết kế, đảm bảo sự cân đối, hài hòa và chính xác từng chi tiết. Các mảnh vải được ép nhẹ bằng bàn là hoặc ép nhiệt, giúp chúng bám chắc trên nền mà vẫn giữ độ mềm mại và tự nhiên. Cuối cùng, nghệ nhân kiểm tra tổng thể và chỉnh sửa nếu cần, đảm bảo bức tranh vừa sống động, vừa bền bỉ theo thời gian, sẵn sàng trưng bày hoặc bàn giao.","image":"/articles/buoc-5.jpg"}]',
'/articles/cach-lam-tranh-cover.jpg', 3, TRUE, '2026-10-17 00:00:00')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  excerpt = VALUES(excerpt),
  content = VALUES(content),
  steps_json = VALUES(steps_json),
  cover_image = VALUES(cover_image),
  display_order = VALUES(display_order),
  is_published = VALUES(is_published),
  published_at = VALUES(published_at);

-- Source: migrations/010_add_threads_contact.sql
INSERT INTO site_settings (setting_key, setting_value, setting_group) VALUES
('threads_url', 'https://www.threads.com/@hoalua.hoaloisong', 'social')
ON DUPLICATE KEY UPDATE setting_key = VALUES(setting_key);
