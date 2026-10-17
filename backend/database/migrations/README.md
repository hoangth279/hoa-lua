# MySQL migrations

Migration `012_add_article_body_images.sql` chèn ảnh minh họa vào giữa nội dung hai bài `tranh-thu-cong-lam-tu-lua` và `qua-tang-lam-tu-lua`, dùng cú pháp Markdown `![alt](/articles/ten-file.jpg)` ngay trong cột `content`. FE (`frontend/src/components/articleContent.js`) tự nhận diện các dòng này thành block ảnh, và gộp các ảnh liền kề thành một dải ảnh đôi (`article-gallery--pair`). Chạy riêng migration 012 trên database đang dùng; không import lại bundle production.

Migration `011_update_article_covers.sql` cập nhật ảnh bìa cho hai bài `tranh-thu-cong-lam-tu-lua` và `qua-tang-lam-tu-lua`, dùng file trong `frontend/public/articles/`. Chỉ thay `cover_image`, giữ nguyên nội dung và ảnh các bước. Với database đang chạy, chạy riêng migration 011 trên đúng database; không import lại bundle production.

Migration `010_add_threads_contact.sql` thêm Threads vào cấu hình mạng xã hội và không ghi đè URL đã chỉnh trong admin. Với database đang chạy, chọn đúng DB và chạy riêng file migration này; không import lại bundle production. API `/api/settings` trả về `threads_url`, có thể sửa tại trang Cấu hình website trong admin.

Chạy từ thư mục gốc dự án:

```bash
mysql -u root -p < backend/database/migrations/001_initial_schema.sql
mysql -u root -p hoa_lua < backend/database/migrations/002_admin_management.sql
mysql -u root -p hoa_lua < backend/database/migrations/003_update_contact_channels.sql
mysql -u root -p hoa_lua < backend/database/seeds/001_demo_content.sql
mysql -u root -p hoa_lua < backend/database/migrations/008_split_story_posts.sql
mysql -u root -p hoa_lua < backend/database/migrations/009_add_articles.sql
mysql -u root -p hoa_lua < backend/database/migrations/010_add_threads_contact.sql
mysql -u root -p hoa_lua < backend/database/migrations/011_update_article_covers.sql
mysql -u root -p hoa_lua < backend/database/migrations/012_add_article_body_images.sql
```

Khi thay đổi schema, hãy thêm file migration mới theo thứ tự `002_...sql`; không sửa migration đã chạy trên production.

Migration `002_admin_management.sql` tạo bảng tài khoản quản trị, cấu hình website và nhật ký thao tác. Migration không tạo sẵn mật khẩu admin.

Migration `003_update_contact_channels.sql` cập nhật email, điện thoại, địa chỉ, Facebook, TikTok và xóa cấu hình Instagram/YouTube cũ.

Migration `006_move_public_campaigns_to_db.sql` chuyển ba hoạt động trước đây viết sẵn trong frontend sang bảng `campaigns`. Chạy trên database đang dùng bằng `mysql -u root -p hoa_lua < backend/database/migrations/006_move_public_campaigns_to_db.sql`. Migration chỉ thêm slug chưa tồn tại, không ghi đè nội dung admin đã sửa và có thể chạy lại.

Trang chủ và `/hoat-dong` đọc campaign từ API. Nội dung campaign là văn bản thuần, hỗ trợ xuống dòng.

Migration `008_split_story_posts.sql` lưu riêng ba mục 01, 02, 03 vào ba bản ghi `posts`. Mỗi bản ghi có tiêu đề và nội dung văn bản thuần của một mục. Phần ảnh, mở đầu và các tiêu đề khối vẫn cố định trong `About.jsx`, không lưu trong DB. Admin `/admin/cau-chuyen` có ba form lưu độc lập; user `/gioi-thieu` đọc các mục đã xuất bản qua `/api/story`.

Migration 007 là phiên bản cũ lưu toàn trang trong một post. Migration 008 chuyển ba nhóm của bản ghi cũ sang ba post, giữ chỉnh sửa và trạng thái xuất bản, sau đó xóa riêng post gộp `cau-chuyen-hoa-lua`. Các post khác không bị xóa. Chạy lại migration 008 không ghi đè ba post đã có. Cài mới chỉ cần migration 008, không cần chạy 007.

Với database đang chạy, chọn đúng DB rồi chạy riêng migration 008. Không import lại toàn bộ bundle production vì bundle còn chứa seed dữ liệu cho lần cài đầu.

Migration `009_add_articles.sql` tạo bảng `articles` (3 bài viết SEO cho mục "Thông tin hữu ích" ở trang chủ và trang Thư viện) cùng dữ liệu khởi tạo 3 bài. Bài có quy trình nhiều bước dùng thêm cột `steps_json` (mảng JSON `{step, title, body, image}`) để FE render bố cục ảnh/chữ so le; các bài còn lại để `NULL`. Có thể chạy lại, không ghi đè nội dung admin đã sửa (`ON DUPLICATE KEY UPDATE`).
