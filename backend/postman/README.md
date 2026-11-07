# Capstone Airbnb - Hướng Dẫn Sử Dụng Postman Collection

Thư mục này chứa đầy đủ tài liệu API Postman phục vụ nộp bài dự án Capstone Airbnb:

## 1. Danh sách file
1. `capstone_airbnb.postman_collection.json`: Bộ sưu tập 36 API chuẩn CyberSoft, chia theo từng module chức năng:
   - **1. Auth (Xác thực)**: Signup, Signin
   - **2. NguoiDung (Quản lý người dùng)**: Lấy danh sách, phân trang, tìm kiếm, lấy chi tiết, cập nhật, xóa, upload avatar
   - **3. ViTri (Quản lý điểm đến/vị trí)**: Lấy danh sách, phân trang, chi tiết, tạo mới, cập nhật, xóa, upload ảnh
   - **4. Phong (Quản lý phòng thuê)**: Lấy danh sách, phân trang, chi tiết, theo vị trí, tạo mới, cập nhật, xóa, upload ảnh
   - **5. DatPhong (Quản lý đặt phòng)**: Lấy danh sách, chi tiết, theo người dùng, tạo đặt phòng, cập nhật, xóa
   - **6. BinhLuan (Quản lý bình luận)**: Lấy danh sách, chi tiết, theo phòng, tạo bình luận, cập nhật, xóa
   - **7. HealthCheck**: Kiểm tra trạng thái máy chủ
2. `capstone_airbnb_production.postman_environment.json`: Môi trường Production trỏ trực tiếp đến Backend Vercel (`https://capstone-backend-airbnb.vercel.app/api`).
3. `capstone_airbnb_local.postman_environment.json`: Môi trường Localhost chạy máy cá nhân (`http://localhost:3000/api`).

## 2. Hướng dẫn Import vào Postman
1. Mở phần mềm **Postman**.
2. Bấm nút **Import** (góc trên bên trái).
3. Kéo thả file `capstone_airbnb.postman_collection.json` và các file môi trường `.postman_environment.json` vào Postman.
4. Chọn Environment ở góc trên bên phải:
   - Chọn **Capstone Airbnb - Production (Vercel)** nếu muốn test trực tiếp trên link Vercel.
   - Chọn **Capstone Airbnb - Local (localhost:3000)** nếu muốn test trên localhost.

## 3. Tính năng tự động lưu Token (Auto JWT Token)
- Khi bạn gọi API `POST /auth/signin` (Đăng nhập), test script sẽ tự động trích xuất JWT Token và lưu vào biến `{{token}}`.
- Tất cả các API yêu cầu xác thực tiếp theo sẽ tự động gắn header `Authorization: Bearer {{token}}` mà không cần bạn copy thủ công.

