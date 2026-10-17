USE hoa_lua;

INSERT INTO site_settings (setting_key, setting_value, setting_group) VALUES
('threads_url', 'https://www.threads.com/@hoalua.hoaloisong', 'social')
ON DUPLICATE KEY UPDATE setting_key = VALUES(setting_key);
