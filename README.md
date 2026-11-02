# 🏡 CAPSTONE DỰ ÁN AIRBNB BACKEND API (NESTJS & PRISMA ORM)

> **Khóa học**: NodeJS 56 - CyberSoft Academy  
> **Học viên**: Huỳnh Gia Huy  
> **Repository GitHub**: [https://github.com/huynhgiahuy236/capstone-bnb](https://github.com/huynhgiahuy236/capstone-bnb)  
> **Đặc tả Swagger mẫu**: [https://airbnbnew.cybersoft.edu.vn/swagger/index.html](https://airbnbnew.cybersoft.edu.vn/swagger/index.html)

---

## 📖 1. GIỚI THIỆU DỰ ÁN
Dự án Capstone cuối khóa xây dựng hệ thống **RESTful API Backend cho nền tảng đặt phòng trực tuyến Airbnb**, được phát triển dựa trên framework **NestJS**, cơ sở dữ liệu **MySQL** kết hợp **Prisma ORM**, tuân thủ nghiêm ngặt các tiêu chuẩn **Clean Code**, kiến trúc module hóa và tự động sinh tài liệu chuẩn hóa qua **Swagger UI**.

Hệ thống cung cấp trọn vẹn **36 API** thuộc 6 phân hệ chức năng:
1. **Auth (2 API)**: Đăng ký, đăng nhập cấp JWT Access Token.
2. **NguoiDung (8 API)**: Quản lý người dùng, phân trang & tìm kiếm, upload avatar qua Cloudinary.
3. **ViTri (7 API)**: Quản lý vị trí / địa điểm du lịch, upload hình ảnh vị trí.
4. **Phong (8 API)**: Quản lý phòng thuê, lọc phòng theo vị trí, quản lý 10 tiện ích boolean, upload hình ảnh phòng.
5. **DatPhong (6 API)**: Nghiệp vụ đặt phòng, kiểm tra check-in / check-out, lịch sử đặt phòng theo người dùng.
6. **BinhLuan (5 API)**: Đánh giá và nhận xét số sao (1 đến 5 sao) theo phòng.

---

## 🛠️ 2. TECH STACK (CÔNG NGHỆ SỬ DỤNG)
* **Ngôn ngữ**: TypeScript (Node.js v20+)
* **Framework**: NestJS (v11)
* **Database & ORM**: MySQL + Prisma ORM (v6)
* **Tài liệu API**: `@nestjs/swagger` + Swagger UI
* **Bảo mật & Xác thực**: `Passport JWT`, `bcrypt` hash mật khẩu, `JwtAuthGuard` & `RolesGuard` (phân quyền ADMIN / USER)
* **Upload hình ảnh**: `Multer` + `Cloudinary SDK` (tự động fallback sang lưu trữ cục bộ `public/images/`)
* **DevOps**: `Docker`, `Docker Compose`

---

## 🗄️ 3. SƠ ĐỒ THIẾT KẾ CƠ SỞ DỮ LIỆU (ERD)

Hệ thống được thiết kế gồm 5 bảng chuẩn hóa quan hệ (1-N):

```
       ┌──────────┐                 ┌──────────┐
       │  ViTri   │ 1 ─────────── N │  Phong   │
       └──────────┘                 └──────────┘
                                      │ 1    │ 1
                                      │      │
                                    N │    N │
       ┌──────────┐                 ┌──────────┐
       │ NguoiDung│ 1 ─────────── N │ DatPhong │
       └──────────┘                 └──────────┘
            │ 1
            │
          N │
       ┌──────────┐
       │ BinhLuan │
       └──────────┘
```

* File script SQL thuần có sẵn: [`prisma/airbnb_database.sql`](./prisma/airbnb_database.sql) (có thể import trực tiếp vào TablePlus / MySQL Workbench).

---

## 🚀 4. HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

### Cách 1: Chạy trực tiếp trên máy cục bộ (Local Development)

1. **Clone repository**:
   ```bash
   git clone https://github.com/huynhgiahuy236/capstone-bnb.git
   cd capstone-bnb
   ```

2. **Cài đặt thư viện**:
   ```bash
   npm install
   ```

3. **Cấu hình môi trường**:
   * Sao chép file `.env.example` thành `.env`:
     ```bash
     cp .env.example .env
     ```
   * Cập nhật chuỗi kết nối MySQL `DATABASE_URL` trong file `.env`.

4. **Khởi tạo Database & Sinh Prisma Client**:
   * Import file [`prisma/airbnb_database.sql`](./prisma/airbnb_database.sql) vào MySQL.
   * Chạy lệnh sinh client:
     ```bash
     npx prisma generate
     ```

5. **Khởi động server**:
   ```bash
   npm run start:dev
   ```
   * Server API: `http://localhost:3000/api`
   * Giao diện Swagger UI: `http://localhost:3000/api/docs`

---

### Cách 2: Chạy trọn gói qua Docker Compose (Khuyên dùng)

Chỉ cần một câu lệnh duy nhất để khởi tạo cả backend NestJS và container cơ sở dữ liệu MySQL (tự động nạp sẵn database schema):

```bash
docker compose up -d
```

Sau khi chạy xong, truy cập ngay Swagger UI tại:
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

---

## 📑 5. ĐẶC TẢ TÀI LIỆU NỘP BÀI (POSTMAN & SWAGGER)
* **File Postman Collection**: [`postman/capstone_airbnb.postman_collection.json`](./postman/capstone_airbnb.postman_collection.json) chứa toàn bộ 36 request mẫu được chia thành 6 thư mục chức năng, có sẵn biến môi trường `{{baseUrl}}` và `{{token}}`.
* **Giao diện Swagger tương tác trực tiếp**: Truy cập `/api/docs` trên trình duyệt để kiểm thử toàn bộ API trực quan.
