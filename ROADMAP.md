# 🗺️ LỘ TRÌNH TRIỂN KHAI DỰ ÁN CAPSTONE AIRBNB (NESTJS)

> **Dự án**: Capstone Backend Airbnb - Khóa NodeJS 56 (CyberSoft)  
> **Repository**: [https://github.com/huynhgiahuy236/capstone-bnb.git](https://github.com/huynhgiahuy236/capstone-bnb.git)  
> **Đặc tả Swagger mẫu**: [https://airbnbnew.cybersoft.edu.vn/swagger/index.html](https://airbnbnew.cybersoft.edu.vn/swagger/index.html)  
> **Framework**: NestJS + Prisma ORM + MySQL + Swagger UI

---

## 📌 NGUYÊN TẮC CỐT LÕI (BẮT BUỘC TUÂN THỦ)

1. **Tuyệt đối không lưu mock data**:
   * Mã nguồn cuối chỉ chứa các file thực sự cần thiết, sạch sẽ (Clean Code).
   * Không commit các script seed/mock rác vào codebase.

2. **Dừng lại nghiệm thu theo từng giai đoạn**:
   * Sau khi hoàn thành mỗi giai đoạn, dừng lại báo cáo chi tiết, cung cấp hướng dẫn kiểm thử và **chờ học viên duyệt** mới chuyển sang giai đoạn kế tiếp.

3. **Cấu trúc Response chuẩn mực**:
   * Kế thừa toàn bộ danh mục mã HTTP status từ `statusCode.helper.js` (Buổi học lớp NodeJS 56).
   * **Thành công**:
     ```json
     {
       "status": "success",
       "statusCode": 200,
       "message": "Xử lý thành công",
       "content": {},
       "dateTime": "2026-11-02T07:55:00.000Z"
     }
     ```
   * **Thất bại / Lỗi**:
     ```json
     {
       "status": "error",
       "statusCode": 400,
       "message": "Lỗi dữ liệu đầu vào",
       "content": ["email must be an email"],
       "dateTime": "2026-11-02T07:55:00.000Z"
     }
     ```

4. **Bỏ qua header `tokenCybersoft`**:
   * Không tạo ô nhập hoặc middleware kiểm tra `tokenCybersoft`.
   * Sử dụng chuẩn xác thực `Bearer Token` (JWT) cho các endpoint yêu cầu quyền đăng nhập.

5. **Quy chuẩn Git & Branching**:
   * Nhánh chính: `main` (Production / Nộp bài) và `develop` (Tích hợp).
   * Nhánh chức năng: `feature/<ten-tinh-nang>`.
   * Commit nguyên tử (Atomic Commit), mô tả rõ ràng theo chuẩn Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).

---

## 🚀 TIẾN ĐỘ 6 GIAI ĐOẠN

- [x] **Giai đoạn 1: Nền tảng NestJS & Hệ thống Common** (Hoàn thành)
  - [x] Khởi tạo Git repository trong `capstone-bnb`, kết nối remote `origin`.
  - [x] Tạo nhánh `main` và `develop`, checkout sang `feature/init-project-and-common`.
  - [x] Khởi tạo dự án NestJS sạch với TypeScript, cấu hình CORS, static file `public/`.
  - [x] Cài đặt các dependencies cần thiết (`@nestjs/swagger`, `class-validator`, `class-transformer`, `bcrypt`, `@nestjs/jwt`, `passport-jwt`, `@prisma/client`, `prisma`).
  - [x] Tích hợp Swagger UI tại `/api/docs` với Bearer Auth.
  - [x] Viết module `src/common/`:
    - [x] `constants/status-code.constant.ts` (Kế thừa từ `statusCode.helper.js`).
    - [x] `interceptors/response.interceptor.ts` (Chuẩn hóa response thành công).
    - [x] `filters/http-exception.filter.ts` (Bắt lỗi toàn cục, format đồng bộ).
    - [x] `decorators/public.decorator.ts`, `decorators/roles.decorator.ts`, `decorators/current-user.decorator.ts`.
    - [x] `guards/jwt-auth.guard.ts` (JWT Guard) & `guards/roles.guard.ts`.
  - [x] Commit, push và **chờ duyệt**.

- [x] **Giai đoạn 2: Thiết kế Database & Prisma ORM Schema** (Hoàn thành)
  - [x] Tạo nhánh `feature/database-and-prisma-schema`.
  - [x] Tạo file SQL thuần chuẩn: `prisma/airbnb_database.sql` (hỗ trợ import trực tiếp vào MySQL/TablePlus).
  - [x] Viết `prisma/schema.prisma` cho 5 bảng chuẩn theo ERD:
    - [x] `NguoiDung`: `id`, `name`, `email`, `pass_word`, `phone`, `birth_day`, `gender`, `role`, `avatar`, `googleId`.
    - [x] `ViTri`: `id`, `ten_vi_tri`, `tinh_thanh`, `quoc_gia`, `hinh_anh`.
    - [x] `Phong`: `id`, `ten_phong`, `khach`, `phong_ngu`, `giuong`, `phong_tam`, `mo_ta`, `gia_tien`, 10 tiện ích boolean, `hinh_anh`, `ma_vi_tri`.
    - [x] `DatPhong`: `id`, `ma_phong`, `ngay_den`, `ngay_di`, `so_luong_khach`, `ma_nguoi_dat`.
    - [x] `BinhLuan`: `id`, `ma_phong`, `ma_nguoi_binh_luan`, `ngay_binh_luan`, `noi_dung`, `sao_binh_luan`.
  - [x] Cấu hình `PrismaModule` & `PrismaService` (@Global).
  - [x] Chạy `npx prisma generate` sinh Prisma Client thành công.
  - [x] Commit, push và **chờ duyệt**.

- [x] **Giai đoạn 3: Module Auth & NguoiDung (10 API)** (Hoàn thành)
  - [x] Tạo nhánh `feature/auth-and-users-module`.
  - [x] **Module Auth (2 API)**:
    - [x] `POST /api/auth/signup`: Đăng ký tài khoản (mã hóa mật khẩu `bcrypt`, kiểm tra trùng email).
    - [x] `POST /api/auth/signin`: Đăng nhập, cấp JWT Access Token.
  - [x] **Module NguoiDung (8 API)**:
    - [x] `GET /api/users`: Lấy danh sách toàn bộ người dùng (loại bỏ pass_word).
    - [x] `POST /api/users`: Tạo người dùng mới (Yêu cầu ADMIN).
    - [x] `DELETE /api/users`: Xóa người dùng theo ID (?id=...) (Yêu cầu ADMIN).
    - [x] `GET /api/users/phan-trang-tim-kiem`: Phân trang & tìm kiếm người dùng.
    - [x] `GET /api/users/{id}`: Xem chi tiết 1 người dùng theo ID.
    - [x] `PUT /api/users/{id}`: Cập nhật thông tin người dùng.
    - [x] `GET /api/users/search/{TenNguoiDung}`: Tìm kiếm người dùng theo tên.
    - [x] `POST /api/users/upload-avatar`: Upload file avatar (Hỗ trợ cả Cloudinary & Local).
  - [x] Commit, push và **chờ duyệt**.

- [x] **Giai đoạn 4: Module ViTri & Phong (15 API)** (Hoàn thành)
  - [x] Tạo nhánh `feature/vi-tri-and-phong-module`.
  - [x] **Module ViTri (7 API)**:
    - [x] `GET /api/vi-tri`: Lấy danh sách vị trí.
    - [x] `POST /api/vi-tri`: Thêm vị trí mới (Yêu cầu ADMIN).
    - [x] `GET /api/vi-tri/phan-trang-tim-kiem`: Phân trang tìm kiếm vị trí.
    - [x] `GET /api/vi-tri/{id}`: Xem chi tiết vị trí.
    - [x] `PUT /api/vi-tri/{id}`: Cập nhật vị trí (Yêu cầu ADMIN).
    - [x] `DELETE /api/vi-tri/{id}`: Xóa vị trí (Yêu cầu ADMIN).
    - [x] `POST /api/vi-tri/upload-hinh-vitri`: Upload hình ảnh vị trí (Cloudinary & Local).
  - [x] **Module Phong (8 API)**:
    - [x] `GET /api/phong-thue`: Lấy toàn bộ danh sách phòng (kèm thông tin vị trí).
    - [x] `POST /api/phong-thue`: Thêm phòng mới với 10 tiện ích boolean (Yêu cầu ADMIN).
    - [x] `GET /api/phong-thue/lay-phong-theo-vi-tri`: Lấy danh sách phòng theo mã vị trí (?maViTri=...).
    - [x] `GET /api/phong-thue/phan-trang-tim-kiem`: Phân trang & tìm kiếm phòng.
    - [x] `GET /api/phong-thue/{id}`: Xem chi tiết phòng.
    - [x] `PUT /api/phong-thue/{id}`: Cập nhật thông tin phòng (Yêu cầu ADMIN).
    - [x] `DELETE /api/phong-thue/{id}`: Xóa phòng (Yêu cầu ADMIN).
    - [x] `POST /api/phong-thue/upload-hinh-phong`: Upload hình ảnh phòng (Cloudinary & Local).
  - [x] Commit, push và **chờ duyệt**.

- [x] **Giai đoạn 5: Module DatPhong & BinhLuan (11 API)** (Hoàn thành)
  - [x] Tạo nhánh `feature/dat-phong-and-binh-luan-module`.
  - [x] **Module DatPhong (6 API)**:
    - [x] `GET /api/dat-phong`: Lấy toàn bộ danh sách đặt phòng.
    - [x] `POST /api/dat-phong`: Tạo lượt đặt phòng mới (kiểm tra ngày đến, ngày đi hợp lệ).
    - [x] `GET /api/dat-phong/{id}`: Xem chi tiết 1 đơn đặt phòng.
    - [x] `PUT /api/dat-phong/{id}`: Cập nhật thông tin đặt phòng.
    - [x] `DELETE /api/dat-phong/{id}`: Hủy đơn đặt phòng.
    - [x] `GET /api/dat-phong/lay-theo-nguoi-dung/{MaNguoiDung}`: Lịch sử đặt phòng của người dùng.
  - [x] **Module BinhLuan (5 API)**:
    - [x] `GET /api/binh-luan`: Lấy tất cả bình luận.
    - [x] `POST /api/binh-luan`: Gửi bình luận và đánh giá sao (1 - 5) (Yêu cầu đăng nhập).
    - [x] `PUT /api/binh-luan/{id}`: Sửa bình luận (Yêu cầu đăng nhập).
    - [x] `DELETE /api/binh-luan/{id}`: Xóa bình luận (Yêu cầu đăng nhập).
    - [x] `GET /api/binh-luan/lay-binh-luan-theo-phong/{MaPhong}`: Lấy danh sách bình luận theo phòng.
  - [x] Commit, push và **chờ duyệt**.

- [x] **Giai đoạn 6: Docker hóa, Clean Code & Bàn giao nộp bài** (Hoàn thành)
  - [x] Tạo nhánh `feature/docker-and-docs`.
  - [x] Rà soát Clean Code (quy tắc đặt tên, bỏ imports/code thừa, format Prettier, tuyệt đối không lưu mock data).
  - [x] Viết `Dockerfile` và `docker-compose.yml` (tự động khởi chạy cả NestJS App và MySQL Container).
  - [x] Tạo file export Postman Collection: `postman/capstone_airbnb.postman_collection.json` để nộp bài.
  - [x] Viết `README.md` hướng dẫn chạy dự án, sơ đồ ERD, danh sách 36 API hoàn chỉnh.
  - [x] Merge `develop` vào `main`, gắn tag version `v1.0.0` và push lên GitHub.


---

## 🚀 PHẦN II: LỘ TRÌNH TÍCH HỢP MONOREPO FRONTEND (NEXT.JS 16)

- [x] **Giai đoạn 1: Chuyển đổi kiến trúc Monorepo (backend/ & frontend/)** (Hoàn thành)
  - [x] Tạo nhánh feature/monorepo-structure.
  - [x] Di chuyển toàn bộ mã nguồn Backend vào backend/.
  - [x] Cập nhật root docker-compose.yml và root .gitignore.
  - [x] Kiểm tra npm run lint và npm run build backend thành công 100%.
  - [x] Merge vào develop và main, push lên GitHub.

- [x] **Giai đoạn 2: Khởi tạo Frontend Next.js 16 & Cấu hình Architecture** (Hoàn thành)
  - [x] Tạo nhánh feature/frontend-init-and-client.
  - [x] Tích hợp mã nguồn Frontend Next.js 16 vào frontend/.
  - [x] Thiết lập frontend/.env.example và frontend/.env.local trỏ về Backend local (http://localhost:3000/api).
  - [x] Chạy npm install, kiểm tra npm run lint (0 lỗi, 0 cảnh báo) và npm run build (Turbopack compile 14 routes thành công).
  - [x] Merge vào develop và push lên GitHub.

- [x] **Giai đoạn 3: Authentication, Profile & Modal Flow (Frontend)** (Hoàn thành)
  - [x] Tạo nhánh feature/frontend-auth-and-profile.
  - [x] Đồng bộ và kiểm thử luồng Đăng nhập (/auth/signin), Đăng ký (/auth/signup) qua AuthModal.
  - [x] Kiểm tra quản lý Session qua localStorage & Cookies (token, userRole).
  - [x] Đồng bộ trang thông tin cá nhân /profile (getUserById, updateUser).
  - [x] Xác thực chức năng upload ảnh đại diện POST /users/upload-avatar (FormData formFile, kiểm tra dung lượng < 1MB).
  - [x] Xác minh 100% npm run lint và npm run build.
  - [x] Merge vào develop và push lên GitHub.

- [ ] **Giai đoạn 4: Location & Room Browsing, Filtering & Search (Frontend)**
  - [ ] Tạo nhánh feature/frontend-rooms-and-locations.
  - [ ] Đồng bộ danh sách vị trí nổi bật, tìm kiếm vị trí theo từ khóa.
  - [ ] Danh sách phòng, phân trang, lọc theo vị trí (maViTri), ngày nhận/trả phòng, số lượng khách.
  - [ ] Bộ lọc 10 tiện ích chuẩn: máy giặt, bàn là, tivi, điều hòa, wifi, bếp, đỗ xe, hồ bơi, bàn ủi.
  - [ ] Chi tiết phòng /rooms/[id], thư viện ảnh, thông tin vị trí và tiện ích.

- [ ] **Giai đoạn 5: Booking Flow, Availability Check & Comments (Frontend)**
  - [ ] Tạo nhánh feature/frontend-booking-and-comments.
  - [ ] Thuật toán kiểm tra phòng trống và chống trùng lịch đặt phòng (overlap prevention).
  - [ ] Tạo đơn đặt phòng POST /dat-phong với tính toán giá tiền tự động theo số đêm.
  - [ ] Trang lịch sử chuyến đi của tôi (My Trips / Booking History) kèm hủy phòng DELETE /dat-phong/{id}.
  - [ ] Hệ thống bình luận và đánh giá sao (1-5 sao) theo phòng /binh-luan/lay-binh-luan-theo-phong/{MaPhong}.

- [ ] **Giai đoạn 6: Admin Dashboard, Vitest Tests, Fullstack Docker & Bàn giao**
  - [ ] Tạo nhánh feature/frontend-admin-and-docker.
  - [ ] Admin Portal quản lý CRUD 4 module: Users, Rooms, Locations, Bookings.
  - [ ] Bổ sung bộ Unit Tests Vitest (49 test cases) bao phủ: API error mapping, Booking availability algorithm, Zod validation schemas.
  - [ ] Cập nhật docker-compose.yml chạy fullstack 3 container: mysql_db (3306), backend (3000), frontend (3001).
  - [ ] Cập nhật toàn diện README.md Monorepo và bàn giao nghiệm thu.
