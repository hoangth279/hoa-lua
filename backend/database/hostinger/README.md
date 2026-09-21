# Import database trên Hostinger

File `production.sql` được tạo dành riêng cho phpMyAdmin: không chứa `CREATE DATABASE` hoặc `USE hoa_lua`, vì tên database Hostinger thường có prefix theo tài khoản.

1. Trong hPanel, vào **Databases → Management** và tạo database/user.
2. Mở phpMyAdmin của database vừa tạo.
3. Chọn đúng database ở cột trái.
4. Chọn **Import** và tải lên `production.sql`.
5. Kiểm tra các bảng `workshops`, `bookings`, `admin_users` và `site_settings` đã xuất hiện.

Khi migration nguồn thay đổi, tạo lại bundle bằng:

```bash
npm run db:bundle:hostinger
```
