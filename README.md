# 🏡 CAPSTONE DỰ ÁN AIRBNB FULLSTACK MONOREPO (NESTJS & NEXT.JS 16)

> **Khóa học**: NodeJS 56 - CyberSoft Academy  
> **Học viên**: Huỳnh Gia Huy  
> **Repository GitHub**: [https://github.com/huynhgiahuy236/capstone-bnb](https://github.com/huynhgiahuy236/capstone-bnb)  
> **Đặc tả Swagger mẫu**: [https://airbnbnew.cybersoft.edu.vn/swagger/index.html](https://airbnbnew.cybersoft.edu.vn/swagger/index.html)  
> **Kiến trúc**: Fullstack Monorepo (`backend/` NestJS + `frontend/` Next.js 16 App Router)

---

## 📖 1. GIỚI THIỆU DỰ ÁN
Dự án Capstone cuối khóa xây dựng toàn diện hệ thống **Nền tảng Đặt phòng Trực tuyến Airbnb Fullstack**, bao gồm:
1. **Backend API (`backend/`)**: Xây dựng bằng **NestJS 11**, **MySQL 8.0**, **Prisma ORM**, chuẩn hóa 36 RESTful API theo đặc tả CyberSoft, bảo mật xác thực JWT, phân quyền RBAC (ADMIN / USER), chuẩn hóa lỗi HTTP Exceptions và tài liệu hóa tự động qua **Swagger UI**.
2. **Frontend Web Application (`frontend/`)**: Xây dựng bằng **Next.js 16 (App Router)**, **React 19**, **TypeScript Strict Mode**, **Tailwind CSS 4**, quản lý state với **Zustand**, đồng bộ dữ liệu & cache với **TanStack React Query v5**, xác thực form với **React Hook Form + Zod**, bộ **49 Unit Tests** toàn diện với **Vitest**, hỗ trợ Dark/Light Theme đồng bộ và cổng **Admin Dashboard** quản trị mạnh mẽ.

---

## 🛠️ 2. TECH STACK (CÔNG NGHỆ SỬ DỤNG)

### Backend (`/backend`)
* **Ngôn ngữ**: TypeScript (Node.js v20+)
* **Framework**: NestJS (v11)
* **Database & ORM**: MySQL 8.0 + Prisma ORM (v6)
* **API Documentation**: `@nestjs/swagger` + Swagger UI (`/api/docs`)
* **Bảo mật & Phân quyền**: Passport JWT, bcrypt password hashing, `JwtAuthGuard`, `RolesGuard`
* **Upload hình ảnh**: Multer + Cloudinary SDK (tự động fallback lưu trữ local disk `public/images/`)
* **Kiểm định code**: ESLint Flat Config + Prettier (0 warning, 0 error)

### Frontend (`/frontend`)
* **Framework**: Next.js 16.2.10 (App Router, Turbopack)
* **Thư viện UI**: React 19.2.4
* **Styling**: Tailwind CSS 4 (Theme Switcher Dark / Light)
* **State Management**: Zustand (Auth Store, Toast Store, Favorites Store)
* **Data Fetching & Cache**: TanStack React Query v5
* **Form & Validation**: React Hook Form + Zod Schema Validation
* **HTTP Client**: Axios với Interceptors tự động gắn Token & xử lý lỗi tập trung
* **Unit Test**: Vitest (49 test cases bao phủ logic nghiệp vụ)

### DevOps & Containerization
* **Docker & Docker Compose**: Điều phối đồng thời 3 containers (`mysql_db`, `backend`, `frontend`)

---

## 📂 3. CẤU TRÚC MONOREPO

```text
capstone-bnb/
├── backend/                                   # NestJS API Backend
│   ├── src/
│   │   ├── common/                            # Filters, Guards, Interceptors, Services
│   │   ├── modules-api/                       # 6 Modules nghiệp vụ chuẩn RESTful
│   │   │   ├── auth/                          # Đăng nhập, đăng ký
│   │   │   ├── users/                         # Quản lý người dùng, avatar
│   │   │   ├── location/                      # Vị trí, hình ảnh vị trí
│   │   │   ├── room/                          # Phòng thuê, 10 tiện ích
│   │   │   ├── booking/                       # Đặt phòng, lịch sử đặt
│   │   │   └── comment/                       # Đánh giá, bình luận
│   │   └── modules-system/                    # Prisma Module kết nối DB
│   ├── prisma/                                # schema.prisma & airbnb_database.sql
│   ├── postman/                               # Collection JSON nộp bài
│   ├── Dockerfile                             # Container build backend
│   └── package.json
│
├── frontend/                                  # Next.js 16 Web Application
│   ├── src/
│   │   ├── app/                               # App Router (14 Routes)
│   │   │   ├── admin/                         # Admin Dashboard (Users, Rooms, Locations, Bookings)
│   │   │   ├── locations/                     # Khám phá điểm đến & chi tiết vị trí
│   │   │   ├── rooms/                         # Danh sách phòng thuê & chi tiết phòng
│   │   │   ├── profile/                       # Thông tin cá nhân & Lịch sử chuyến đi
│   │   │   ├── favorites/                     # Danh sách phòng yêu thích
│   │   │   └── components/                    # Reusable UI Components
│   │   └── lib/                               # API Client, Schemas, Availability Engine
│   ├── tests/                                 # Bộ Unit Test (49 test cases)
│   │   ├── api-error.test.ts                  # Test xử lý lỗi API & mapping email trùng
│   │   ├── booking-availability.test.ts       # Test thuật toán overlap & ràng buộc đặt phòng
│   │   └── validation-schemas.test.ts         # Test Zod validation schemas
│   ├── Dockerfile                             # Container build frontend
│   └── package.json
│
├── docker-compose.yml                         # Fullstack Docker Orchestration
├── README.md                                  # Hướng dẫn chi tiết
└── ROADMAP.md                                 # Lộ trình và nhật ký Gitflow
```

---

## 🗄️ 4. SƠ ĐỒ THIẾT KẾ CƠ SỞ DỮ LIỆU (ERD)

```text
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

* File SQL: [`backend/prisma/airbnb_database.sql`](./backend/prisma/airbnb_database.sql) (5 bảng, InnoDB, charset `utf8mb4`, hỗ trợ Soft Delete `is_deleted`).

---

## 🚀 5. HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

### Cách 1: Chạy trọn gói qua Docker Compose (Khuyên dùng)
Chỉ với 1 lệnh duy nhất, toàn bộ hệ thống gồm MySQL Database, Backend API và Frontend Web sẽ tự động được khởi tạo:

```bash
docker compose up --build -d
```

Sau khi các containers khởi chạy thành công:
* **Frontend Web App**: `http://localhost:3001`
* **Backend API Swagger**: `http://localhost:3000/api/docs`
* **MySQL Database**: `localhost:3306` (User: `root`, Password: `12345`, DB: `capstone_airbnb`)

Dừng hệ thống:
```bash
docker compose down
```

---

### Cách 2: Chạy trực tiếp trên máy cục bộ (Local Development)

#### Bước 1: Khởi động Backend
1. Mở terminal tại thư mục backend:
   ```bash
   cd backend
   ```
2. Cài đặt dependencies:
   ```bash
   npm install
   ```
3. Cấu hình file `.env` (tạo từ `.env.example`):
   ```env
   PORT=3000
   DATABASE_URL="mysql://root:12345@localhost:3307/capstone_airbnb"
   JWT_SECRET="CYBERSOFT_AIRBNB_SECRET_KEY_2026"
   JWT_EXPIRES_IN="7d"
   ```
4. Sinh Prisma Client & khởi động:
   ```bash
   npx prisma generate
   npm run start:dev
   ```
   Backend sẽ lắng nghe tại: `http://localhost:3000/api/docs`.

#### Bước 2: Khởi động Frontend
1. Mở terminal tại thư mục frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt dependencies:
   ```bash
   npm install
   ```
3. Cấu hình file `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3000/api"
   NEXT_PUBLIC_TOKEN_CYBERSOFT=""
   ```
4. Khởi động Next.js:
   ```bash
   npm run dev
   ```
   Frontend sẽ truy cập được tại: `http://localhost:3000` (hoặc `http://localhost:3001`).

---

## 🧪 6. KIỂM CHUẨN CHẤT LƯỢNG & TESTING

### 1. Chạy Bộ Unit Test (Vitest)
Bộ 49 unit tests bao phủ toàn diện các logic quan trọng nhất:
```bash
cd frontend
npm test
```
* **Kết quả**: `49 passed (49)` 100% pass!
  - `tests/api-error.test.ts`: 12 test cases
  - `tests/booking-availability.test.ts`: 17 test cases
  - `tests/validation-schemas.test.ts`: 20 test cases

### 2. Kiểm tra Linting & Type Safety
* **Backend**:
  ```bash
  cd backend
  npm run lint
  npm run build
  ```
  *(0 errors, 0 warnings, build thành công)*
* **Frontend**:
  ```bash
  cd frontend
  npm run lint
  npm run build
  ```
  *(0 errors, 0 warnings, Turbopack compile thành công 14 routes)*

---

## 📋 7. DANH MỤC 36 RESTFUL API (BACKEND)

| Phân hệ | Phương thức | Endpoint | Mô tả | Quyền |
| :--- | :---: | :--- | :--- | :---: |
| **Auth** | `POST` | `/api/auth/signin` | Đăng nhập tài khoản, trả về JWT Access Token | Public |
| **Auth** | `POST` | `/api/auth/signup` | Đăng ký tài khoản người dùng mới | Public |
| **NguoiDung** | `GET` | `/api/users` | Lấy danh sách toàn bộ người dùng | Public |
| **NguoiDung** | `POST` | `/api/users` | Tạo người dùng mới | ADMIN |
| **NguoiDung** | `DELETE` | `/api/users` | Xóa người dùng (`?id=...`) | ADMIN |
| **NguoiDung** | `GET` | `/api/users/phan-trang-tim-kiem` | Phân trang & tìm kiếm người dùng | Public |
| **NguoiDung** | `GET` | `/api/users/{id}` | Lấy chi tiết thông tin 1 người dùng | Public |
| **NguoiDung** | `PUT` | `/api/users/{id}` | Cập nhật thông tin người dùng | Bearer |
| **NguoiDung** | `GET` | `/api/users/search/{TenNguoiDung}` | Tìm kiếm người dùng theo tên | Public |
| **NguoiDung** | `POST` | `/api/users/upload-avatar` | Upload avatar đại diện (`formFile`) | Bearer |
| **ViTri** | `GET` | `/api/vi-tri` | Lấy toàn bộ danh sách vị trí | Public |
| **ViTri** | `POST` | `/api/vi-tri` | Tạo mới vị trí du lịch | ADMIN |
| **ViTri** | `GET` | `/api/vi-tri/phan-trang-tim-kiem` | Phân trang & tìm kiếm vị trí | Public |
| **ViTri** | `GET` | `/api/vi-tri/{id}` | Lấy thông tin chi tiết vị trí theo ID | Public |
| **ViTri** | `PUT` | `/api/vi-tri/{id}` | Cập nhật thông tin vị trí | ADMIN |
| **ViTri** | `DELETE` | `/api/vi-tri/{id}` | Xóa vị trí du lịch | ADMIN |
| **ViTri** | `POST` | `/api/vi-tri/upload-hinh-vitri` | Upload hình ảnh vị trí (`?maViTri=...`) | ADMIN |
| **Phong** | `GET` | `/api/phong-thue` | Lấy danh sách toàn bộ phòng thuê | Public |
| **Phong** | `POST` | `/api/phong-thue` | Thêm phòng thuê mới với 10 tiện ích boolean | ADMIN |
| **Phong** | `GET` | `/api/phong-thue/lay-phong-theo-vi-tri`| Lọc danh sách phòng theo mã vị trí | Public |
| **Phong** | `GET` | `/api/phong-thue/phan-trang-tim-kiem` | Phân trang & tìm kiếm phòng thuê | Public |
| **Phong** | `GET` | `/api/phong-thue/{id}` | Lấy thông tin chi tiết phòng theo ID | Public |
| **Phong** | `PUT` | `/api/phong-thue/{id}` | Cập nhật thông tin phòng thuê | ADMIN |
| **Phong** | `DELETE` | `/api/phong-thue/{id}` | Xóa phòng thuê | ADMIN |
| **Phong** | `POST` | `/api/phong-thue/upload-hinh-phong` | Upload hình ảnh phòng (`?maPhong=...`) | ADMIN |
| **DatPhong** | `GET` | `/api/dat-phong` | Lấy danh sách toàn bộ lượt đặt phòng | Public |
| **DatPhong** | `POST` | `/api/dat-phong` | Tạo lượt đặt phòng mới | Bearer |
| **DatPhong** | `GET` | `/api/dat-phong/{id}` | Lấy thông tin chi tiết lượt đặt phòng | Bearer |
| **DatPhong** | `PUT` | `/api/dat-phong/{id}` | Cập nhật thông tin đặt phòng | Bearer |
| **DatPhong** | `DELETE` | `/api/dat-phong/{id}` | Hủy lượt đặt phòng | Bearer |
| **DatPhong** | `GET` | `/api/dat-phong/lay-theo-nguoi-dung/{MaNguoiDung}` | Lấy danh sách đặt phòng theo người dùng | Bearer |
| **BinhLuan** | `GET` | `/api/binh-luan` | Lấy toàn bộ danh sách bình luận | Public |
| **BinhLuan** | `POST` | `/api/binh-luan` | Đăng bình luận & đánh giá 1 - 5 sao | Bearer |
| **BinhLuan** | `PUT` | `/api/binh-luan/{id}` | Chỉnh sửa nội dung bình luận | Bearer |
| **BinhLuan** | `DELETE` | `/api/binh-luan/{id}` | Xóa bình luận | Bearer |
| **BinhLuan** | `GET` | `/api/binh-luan/lay-binh-luan-theo-phong/{MaPhong}` | Lấy danh sách bình luận theo phòng | Public |
