# Họa Lụa

Website cho chiến dịch nghệ thuật phi lợi nhuận Họa Lụa, gồm giao diện React/Vite, API Express và cơ sở dữ liệu MySQL.

## Chức năng

- Trang giới thiệu câu chuyện, hoạt động và chiến dịch.
- Danh sách workshop, số chỗ còn lại và form đăng ký có kiểm tra sức chứa.
- Contact form lưu dữ liệu vào MySQL.
- Trang Câu chuyện lấy nội dung từ bảng `posts`, gallery ảnh/video.
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
mysql -u root -p hoa_lua < backend/database/migrations/008_split_story_posts.sql
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

- Dashboard thống kê booking, liên hệ, workshop và trạng thái xuất bản Câu chuyện.
- Quản lý campaign, workshop, Câu chuyện và gallery.
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
| GET | `/api/story` | Ba mục Câu chuyện đã xuất bản từ bảng posts |
| GET | `/api/admin/story` | Ba mục Câu chuyện để quản trị, gồm cả bản nháp |
| PUT | `/api/admin/story/:slug` | Lưu riêng một mục Câu chuyện |
| GET | `/api/gallery` | Gallery công khai |
| POST | `/api/contacts` | Gửi liên hệ |

Campaign và ba mục 01/02/03 của Câu chuyện lấy từ MySQL qua API. Admin quản lý ở `/admin/campaigns` và `/admin/cau-chuyen`. Trang `/gioi-thieu` gọi `/api/story`, đọc ba bản ghi `posts` có slug `luu-giu-di-san-van-hoa-viet`, `luu-giu-nghe-nhan-song-xanh`, `luu-giu-ket-noi-the-he-tre`. Mỗi post lưu tiêu đề và nội dung của một mục; `content` là văn bản thuần, các đoạn cách nhau một dòng trống, phần nhãn trước dấu hai chấm được in đậm. Mỗi mục được sửa và bật/tắt xuất bản độc lập, giữ số thứ tự 01/02/03.

Ảnh, tiêu đề “Lụa dệt ký ức / giữ màu thời gian”, các đoạn giới thiệu, nhãn và tiêu đề khối “Những điều lụa lưu giữ” được viết cố định trong `About.jsx`. Các phần này vẫn hiển thị khi API lỗi hoặc các post đang ẩn. Văn bản DB được render an toàn, không thực thi HTML.

Trang Bài viết công khai và mục Bài viết trên Trang chủ/menu đã bỏ. URL cũ `/bai-viet`, `/bai-viet/:slug` chuyển về `/gioi-thieu`; `/admin/bai-viet` chuyển về `/admin/cau-chuyen`. API posts cũ vẫn được giữ để tương thích, nhưng frontend user không gọi các API này.

Với database đã cài trước đây, chạy thêm `backend/database/migrations/006_move_public_campaigns_to_db.sql` để chuyển ba hoạt động từng viết sẵn trong frontend sang DB. File này chỉ thêm slug chưa có, giữ nội dung admin đã chỉnh sửa. Không cần import lại toàn bộ bundle production cho database đang sử dụng.

Chạy `backend/database/migrations/008_split_story_posts.sql` để khởi tạo ba mục từ nội dung trang Câu chuyện. Nếu đã chạy migration 007 trước đây, migration 008 giữ nội dung ba mục đã sửa, tách thành ba post rồi xóa riêng bản ghi gộp `cau-chuyen-hoa-lua`. Chạy lại không ghi đè ba post đã có và không xóa post khác. Cài mới không cần chạy migration 007; bundle Hostinger mới dùng trực tiếp migration 008.

Kiểm thử tích hợp nội dung trên MySQL (PowerShell):

```powershell
$env:RUN_DB_TESTS='1'
node --test backend/tests/content-db.integration.test.cjs
```

Bộ kiểm thử đọc cấu hình `backend/.env`, tạo bảng tạm trên một kết nối riêng và tự dọn dẹp; không sửa dữ liệu thật.

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
