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
