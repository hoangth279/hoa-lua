USE hoa_lua;

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
