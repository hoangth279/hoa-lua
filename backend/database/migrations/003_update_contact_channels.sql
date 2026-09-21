USE hoa_lua;

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
