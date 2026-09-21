# Họa Lụa

Website cho chiến dịch nghệ thuật phi lợi nhuận Họa Lụa, gồm giao diện React/Vite, API Express và cơ sở dữ liệu MySQL.

## Chức năng

- Trang giới thiệu câu chuyện, hoạt động và chiến dịch.
- Danh sách workshop, số chỗ còn lại và form đăng ký có kiểm tra sức chứa.
- Contact form lưu dữ liệu vào MySQL.
- Tin tức, bài viết chi tiết, gallery ảnh/video.
- Social links, responsive, metadata SEO/Open Graph cơ bản.
- API có validation đầu vào, CORS, rate limit và xử lý lỗi tập trung.

## Yêu cầu

- Node.js 20+
- npm 10+
- MySQL 8+

## Cài đặt

```bash
npm install
copy backend\\.env.example backend\\.env
copy frontend\\.env.example frontend\\.env
```

Cập nhật tài khoản MySQL trong `backend/.env`, sau đó tạo schema và dữ liệu mẫu:

```bash
mysql -u root -p < backend/database/migrations/001_initial_schema.sql
mysql -u root -p hoa_lua < backend/database/migrations/002_admin_management.sql
mysql -u root -p hoa_lua < backend/database/migrations/003_update_contact_channels.sql
mysql -u root -p hoa_lua < backend/database/seeds/001_demo_content.sql
```

Chạy FE và BE cùng lúc:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health check: http://localhost:3000/api/health
- Admin: http://localhost:5173/admin

## Tạo tài khoản admin

Sau khi chạy migration `002_admin_management.sql`, đặt các biến môi trường tạm thời và chạy script tạo tài khoản. Mật khẩu phải có ít nhất 6 ký tự; nên sử dụng từ 12 ký tự trở lên trên production.

PowerShell:

```powershell
$env:ADMIN_EMAIL="admin@hoalua.vn"
$env:ADMIN_PASSWORD="mat-khau-manh-cua-ban"
$env:ADMIN_NAME="Quản trị viên Họa Lụa"
$env:ADMIN_ROLE="super_admin"
npm run admin:create --workspace=backend
```

Khu vực admin hỗ trợ:

- Dashboard thống kê booking, liên hệ, workshop và bài viết.
- Quản lý campaign, workshop, bài viết và gallery.
- Xác nhận/hủy booking và cập nhật trạng thái tham dự.
- Tiếp nhận, phân loại và phản hồi liên hệ.
- Cập nhật email, social media và mô tả SEO.
- Hai vai trò `super_admin` và `editor`; chỉ `super_admin` được xóa dữ liệu hoặc thay đổi cấu hình.
- Nhật ký audit cho các thao tác tạo, sửa, xóa và thay đổi trạng thái.

## API

| Method | Endpoint | Mục đích |
| --- | --- | --- |
| GET | `/api/health` | Kiểm tra API và database |
| GET | `/api/campaigns` | Danh sách chiến dịch |
| GET | `/api/workshops` | Workshop sắp diễn ra và số chỗ còn lại |
| POST | `/api/bookings` | Đăng ký workshop |
| GET | `/api/posts` | Danh sách bài viết |
| GET | `/api/posts/:slug` | Chi tiết bài viết |
| GET | `/api/gallery` | Gallery công khai |
| POST | `/api/contacts` | Gửi liên hệ |

## Database

- Schema: `backend/database/migrations/001_initial_schema.sql`
- Admin schema: `backend/database/migrations/002_admin_management.sql`
- Demo data: `backend/database/seeds/001_demo_content.sql`
- Khi cập nhật schema, thêm migration mới (`002_...sql`, `003_...sql`), không chỉnh sửa migration đã chạy trên production.

## Build frontend

```bash
npm run build:frontend
```

Thiết lập `VITE_API_URL` thành URL backend production trước khi build.

## Deploy Hostinger trên cùng domain

Ứng dụng production chạy dưới một Node.js Web App duy nhất: Express phục vụ frontend đã build và API tại `/api`.

Thiết lập Hostinger:

- Framework: `Express.js` (hoặc `Other` nếu không có Express.js)
- Root directory: `.` (thư mục gốc repository, không phải `frontend`)
- Node.js: `22.x`
- Build command: `npm run build`
- Start command: `npm start`

Các biến môi trường bắt buộc:

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
FRONTEND_URL=https://hoalua.com,https://www.hoalua.com
JWT_SECRET=replace-with-a-random-secret-at-least-32-characters
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_hostinger_database_user
DB_PASSWORD=your_hostinger_database_password
DB_NAME=your_hostinger_database_name
DB_CONNECTION_LIMIT=10
```

Trong lần deploy đầu tiên có thể thêm `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, `ADMIN_ROLE` để bootstrap admin. Sau khi đăng nhập thành công, nên xóa `ADMIN_PASSWORD` khỏi biến môi trường Hostinger.

Database Hostinger thường có prefix trong tên. Chọn database trong phpMyAdmin rồi import `backend/database/hostinger/production.sql`; file này không chứa `CREATE DATABASE` hoặc `USE hoa_lua`.
