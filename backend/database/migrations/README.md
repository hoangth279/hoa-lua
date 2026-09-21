# MySQL migrations

Chạy từ thư mục gốc dự án:

```bash
mysql -u root -p < backend/database/migrations/001_initial_schema.sql
mysql -u root -p hoa_lua < backend/database/migrations/002_admin_management.sql
mysql -u root -p hoa_lua < backend/database/migrations/003_update_contact_channels.sql
mysql -u root -p hoa_lua < backend/database/seeds/001_demo_content.sql
```

Khi thay đổi schema, hãy thêm file migration mới theo thứ tự `002_...sql`; không sửa migration đã chạy trên production.

Migration `002_admin_management.sql` tạo bảng tài khoản quản trị, cấu hình website và nhật ký thao tác. Migration không tạo sẵn mật khẩu admin.

Migration `003_update_contact_channels.sql` cập nhật email, điện thoại, địa chỉ, Facebook, TikTok và xóa cấu hình Instagram/YouTube cũ.
