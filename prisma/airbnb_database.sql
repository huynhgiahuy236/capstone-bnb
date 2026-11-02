-- ==============================================================
-- CAPSTONE AIRBNB DATABASE SCRIPT (CYBERSOFT NODEJS 56)
-- Hệ quản trị CSDL: MySQL / MariaDB
-- Bảng mã: utf8mb4_unicode_ci (Hỗ trợ tiếng Việt đầy đủ)
-- ==============================================================

CREATE DATABASE IF NOT EXISTS `capstone_airbnb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `capstone_airbnb`;

-- --------------------------------------------------------------
-- 1. BẢNG NGƯỜI DÙNG (NguoiDung)
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `NguoiDung` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL COMMENT 'Họ tên người dùng',
    `email` VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email đăng nhập (Duy nhất)',
    `pass_word` VARCHAR(255) NULL COMMENT 'Mật khẩu đã mã hoá bcrypt',
    `phone` VARCHAR(50) NULL COMMENT 'Số điện thoại',
    `birth_day` VARCHAR(50) NULL COMMENT 'Ngày sinh (chuỗi định dạng)',
    `gender` VARCHAR(20) NULL DEFAULT 'Nam' COMMENT 'Giới tính (Nam/Nữ hoặc boolean)',
    `role` VARCHAR(50) NOT NULL DEFAULT 'USER' COMMENT 'Vai trò: ADMIN hoặc USER',
    `avatar` TEXT NULL COMMENT 'Link ảnh đại diện (Cloudinary / Local)',
    `googleId` VARCHAR(255) NULL COMMENT 'ID tài khoản Google nếu login bằng Google',
    
    -- Cột hệ thống / Audit & Soft Delete (Mặc định chuẩn dự án)
    `isDeleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0: Chưa xóa, 1: Đã xóa mềm',
    `deletedAt` TIMESTAMP NULL DEFAULT NULL COMMENT 'Thời gian xóa mềm',
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật',
    
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 2. BẢNG VỊ TRÍ (ViTri)
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ViTri` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `ten_vi_tri` VARCHAR(255) NOT NULL COMMENT 'Tên vị trí (VD: Quận 1, Bãi Sau, Phố Cổ)',
    `tinh_thanh` VARCHAR(255) NOT NULL COMMENT 'Tỉnh/Thành phố (VD: Hồ Chí Minh, Hà Nội, Đà Lạt)',
    `quoc_gia` VARCHAR(255) NOT NULL DEFAULT 'Việt Nam' COMMENT 'Quốc gia',
    `hinh_anh` TEXT NULL COMMENT 'Hình ảnh đại diện vị trí',
    
    -- Cột hệ thống
    `isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
    `deletedAt` TIMESTAMP NULL DEFAULT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 3. BẢNG PHÒNG THUÊ (Phong)
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Phong` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `ten_phong` VARCHAR(255) NOT NULL COMMENT 'Tên phòng thuê',
    `khach` INT NOT NULL DEFAULT 1 COMMENT 'Số lượng khách tối đa',
    `phong_ngu` INT NOT NULL DEFAULT 1 COMMENT 'Số phòng ngủ',
    `giuong` INT NOT NULL DEFAULT 1 COMMENT 'Số giường ngủ',
    `phong_tam` INT NOT NULL DEFAULT 1 COMMENT 'Số phòng tắm',
    `mo_ta` TEXT NULL COMMENT 'Mô tả chi tiết phòng',
    `gia_tien` INT NOT NULL DEFAULT 0 COMMENT 'Giá tiền thuê theo đêm (VNĐ)',
    
    -- Danh sách tiện ích boolean
    `may_giat` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Có máy giặt không',
    `ban_la` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Có bàn là không',
    `tivi` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Có TV không',
    `dieu_hoa` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Có điều hòa không',
    `wifi` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Có Wifi không',
    `bep` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Có bếp nấu không',
    `do_xe` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Có chỗ đỗ xe không',
    `ho_boi` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Có hồ bơi không',
    `ban_ui` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Có bàn ủi không',
    
    `hinh_anh` TEXT NULL COMMENT 'Hình ảnh phòng thuê',
    `ma_vi_tri` INT NULL COMMENT 'Khoá ngoại liên kết bảng ViTri',
    
    -- Cột hệ thống
    `isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
    `deletedAt` TIMESTAMP NULL DEFAULT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_phong_vi_tri` (`ma_vi_tri`),
    CONSTRAINT `fk_phong_vi_tri` FOREIGN KEY (`ma_vi_tri`) REFERENCES `ViTri` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 4. BẢNG ĐẶT PHÒNG (DatPhong)
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `DatPhong` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `ma_phong` INT NOT NULL COMMENT 'Mã phòng được đặt',
    `ngay_den` DATETIME NOT NULL COMMENT 'Ngày check-in',
    `ngay_di` DATETIME NOT NULL COMMENT 'Ngày check-out',
    `so_luong_khach` INT NOT NULL DEFAULT 1 COMMENT 'Số lượng khách lưu trú',
    `ma_nguoi_dat` INT NOT NULL COMMENT 'Mã người dùng thực hiện đặt phòng',
    
    -- Cột hệ thống
    `isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
    `deletedAt` TIMESTAMP NULL DEFAULT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_datphong_phong` (`ma_phong`),
    INDEX `idx_datphong_nguoidung` (`ma_nguoi_dat`),
    CONSTRAINT `fk_datphong_phong` FOREIGN KEY (`ma_phong`) REFERENCES `Phong` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_datphong_nguoidung` FOREIGN KEY (`ma_nguoi_dat`) REFERENCES `NguoiDung` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 5. BẢNG BÌNH LUẬN (BinhLuan)
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `BinhLuan` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `ma_phong` INT NOT NULL COMMENT 'Mã phòng nhận bình luận',
    `ma_nguoi_binh_luan` INT NOT NULL COMMENT 'Mã người dùng viết bình luận',
    `ngay_binh_luan` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày giờ bình luận',
    `noi_dung` TEXT NOT NULL COMMENT 'Nội dung đánh giá, nhận xét',
    `sao_binh_luan` INT NOT NULL DEFAULT 5 COMMENT 'Đánh giá số sao (1 đến 5)',
    
    -- Cột hệ thống
    `isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
    `deletedAt` TIMESTAMP NULL DEFAULT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_binhluan_phong` (`ma_phong`),
    INDEX `idx_binhluan_nguoidung` (`ma_nguoi_binh_luan`),
    CONSTRAINT `fk_binhluan_phong` FOREIGN KEY (`ma_phong`) REFERENCES `Phong` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_binhluan_nguoidung` FOREIGN KEY (`ma_nguoi_binh_luan`) REFERENCES `NguoiDung` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

