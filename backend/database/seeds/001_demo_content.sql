USE hoa_lua;

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
