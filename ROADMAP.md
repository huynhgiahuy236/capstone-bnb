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

- [ ] **Giai đoạn 3: Module Auth & NguoiDung (10 API)**
  - [ ] Tạo nhánh `feature/auth-and-users-module`.
  - [ ] **Module Auth (2 API)**:
    - [ ] `POST /api/auth/signup`: Đăng ký tài khoản (mã hóa mật khẩu `bcrypt`).
    - [ ] `POST /api/auth/signin`: Đăng nhập, cấp JWT Token.
  - [ ] **Module NguoiDung (8 API)**:
    - [ ] `GET /api/users`: Lấy danh sách toàn bộ người dùng.
    - [ ] `POST /api/users`: Tạo người dùng mới.
    - [ ] `DELETE /api/users`: Xóa người dùng theo ID.
    - [ ] `GET /api/users/phan-trang-tim-kiem`: Phân trang & tìm kiếm người dùng.
    - [ ] `GET /api/users/{id}`: Xem chi tiết 1 người dùng.
    - [ ] `PUT /api/users/{id}`: Cập nhật thông tin người dùng.
    - [ ] `GET /api/users/search/{TenNguoiDung}`: Tìm kiếm người dùng theo tên.
    - [ ] `POST /api/users/upload-avatar`: Upload file avatar (Multer).
  - [ ] Commit, push và **chờ duyệt**.

- [ ] **Giai đoạn 4: Module ViTri & Phong (15 API)**
  - [ ] Tạo nhánh `feature/vi-tri-and-phong-module`.
  - [ ] **Module ViTri (7 API)**:
    - [ ] `GET /api/vi-tri`: Lấy danh sách vị trí.
    - [ ] `POST /api/vi-tri`: Thêm vị trí mới.
    - [ ] `GET /api/vi-tri/phan-trang-tim-kiem`: Phân trang tìm kiếm vị trí.
    - [ ] `GET /api/vi-tri/{id}`: Xem chi tiết vị trí.
    - [ ] `PUT /api/vi-tri/{id}`: Cập nhật vị trí.
    - [ ] `DELETE /api/vi-tri/{id}`: Xóa vị trí.
    - [ ] `POST /api/vi-tri/upload-hinh-vitri`: Upload hình ảnh vị trí.
  - [ ] **Module Phong (8 API)**:
    - [ ] `GET /api/phong-thue`: Lấy toàn bộ danh sách phòng.
    - [ ] `POST /api/phong-thue`: Thêm phòng mới.
    - [ ] `GET /api/phong-thue/lay-phong-theo-vi-tri`: Lấy danh sách phòng theo mã vị trí.
    - [ ] `GET /api/phong-thue/phan-trang-tim-kiem`: Phân trang & tìm kiếm phòng.
    - [ ] `GET /api/phong-thue/{id}`: Xem chi tiết phòng.
    - [ ] `PUT /api/phong-thue/{id}`: Cập nhật thông tin phòng.
    - [ ] `DELETE /api/phong-thue/{id}`: Xóa phòng.
    - [ ] `POST /api/phong-thue/upload-hinh-phong`: Upload hình ảnh phòng.
  - [ ] Commit, push và **chờ duyệt**.

- [ ] **Giai đoạn 5: Module DatPhong & BinhLuan (11 API)**
  - [ ] Tạo nhánh `feature/dat-phong-and-binh-luan-module`.
  - [ ] **Module DatPhong (6 API)**:
    - [ ] `GET /api/dat-phong`: Lấy toàn bộ danh sách đặt phòng.
    - [ ] `POST /api/dat-phong`: Tạo lượt đặt phòng.
    - [ ] `GET /api/dat-phong/{id}`: Xem chi tiết 1 đơn đặt phòng.
    - [ ] `PUT /api/dat-phong/{id}`: Cập nhật thông tin đặt phòng.
    - [ ] `DELETE /api/dat-phong/{id}`: Hủy đơn đặt phòng.
    - [ ] `GET /api/dat-phong/lay-theo-nguoi-dung/{MaNguoiDung}`: Lịch sử đặt phòng của người dùng.
  - [ ] **Module BinhLuan (5 API)**:
    - [ ] `GET /api/binh-luan`: Lấy tất cả bình luận.
    - [ ] `POST /api/binh-luan`: Gửi bình luận và đánh giá sao (1 - 5).
    - [ ] `PUT /api/binh-luan/{id}`: Sửa bình luận.
    - [ ] `DELETE /api/binh-luan/{id}`: Xóa bình luận.
    - [ ] `GET /api/binh-luan/lay-binh-luan-theo-phong/{MaPhong}`: Lấy danh sách bình luận theo phòng.
  - [ ] Commit, push và **chờ duyệt**.

- [ ] **Giai đoạn 6: Docker hóa, Clean Code & Bàn giao nộp bài**
  - [ ] Tạo nhánh `feature/docker-and-docs`.
  - [ ] Rà soát Clean Code (quy tắc đặt tên, bỏ imports/code thừa, format Prettier).
  - [ ] Viết `Dockerfile` và `docker-compose.yml`.
  - [ ] Tạo file export Postman Collection để nộp bài.
  - [ ] Viết `README.md` hướng dẫn chạy dự án, danh sách 36 API.
  - [ ] Merge `develop` vào `main`, gắn tag version `v1.0.0` và push lên GitHub.

