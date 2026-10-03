USE hoa_lua;

INSERT INTO site_settings (setting_key, setting_value, setting_group) VALUES
('instagram_url', 'https://www.instagram.com/hoalua.hoaloisong', 'social')
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  setting_group = VALUES(setting_group);
