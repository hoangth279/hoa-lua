USE hoa_lua;

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
