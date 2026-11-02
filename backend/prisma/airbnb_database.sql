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


-- ==============================================================
-- DỮ LIỆU KHỞI TẠO MẪU CHUẨN HOÁ (SAMPLE SEED DATA)
-- ==============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------------
-- 1. DỮ LIỆU BẢNG NGUOIDUNG (Mật khẩu: Admin123@ và User123@)
-- --------------------------------------------------------------
INSERT INTO `NguoiDung` (`id`, `name`, `email`, `pass_word`, `phone`, `birth_day`, `gender`, `role`, `avatar`, `isDeleted`) VALUES
(1, 'Quản Trị Viên Hệ Thống', 'admin@airbnb.com', '$2b$10$8wlD6GiA/TSJvKA.6UV0NueueVoy0ngrLRoson4K1qm0/qau3p5Gy', '0901234567', '1990-01-01', 'Nam', 'ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 0),
(2, 'Trần Thị Mai', 'mai.tran@airbnb.com', '$2b$10$D4Mcu.E7ZV8XxXzXpS6u5eOAOdTylcNoqhXCMxo8ewZg4eQJtCbzC', '0918765432', '1996-08-15', 'Nữ', 'USER', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', 0),
(3, 'Nguyễn Văn An', 'user@airbnb.com', '$2b$10$D4Mcu.E7ZV8XxXzXpS6u5eOAOdTylcNoqhXCMxo8ewZg4eQJtCbzC', '0988776655', '1995-04-20', 'Nam', 'USER', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 0)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `pass_word`=VALUES(`pass_word`), `role`=VALUES(`role`), `avatar`=VALUES(`avatar`);

-- --------------------------------------------------------------
-- 2. DỮ LIỆU BẢNG VITRI (8 Điểm Đến Du Lịch Nổi Bật)
-- --------------------------------------------------------------
INSERT INTO `ViTri` (`id`, `ten_vi_tri`, `tinh_thanh`, `quoc_gia`, `hinh_anh`, `isDeleted`) VALUES
(1, 'Quận 1 - Bến Thành', 'Hồ Chí Minh', 'Việt Nam', 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80', 0),
(2, 'Phố Cổ Hoàn Kiếm', 'Hà Nội', 'Việt Nam', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80', 0),
(3, 'Thung Lũng Tình Yêu', 'Đà Lạt', 'Việt Nam', 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80', 0),
(4, 'Bãi Biển Mỹ Khê', 'Đà Nẵng', 'Việt Nam', 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80', 0),
(5, 'Vịnh Nha Trang', 'Khánh Hòa', 'Việt Nam', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', 0),
(6, 'Bãi Dài Đảo Ngọc', 'Phú Quốc', 'Việt Nam', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 0),
(7, 'Phố Cổ Hội An', 'Quảng Nam', 'Việt Nam', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80', 0),
(8, 'Bãi Trước - Hải Đăng', 'Vũng Tàu', 'Việt Nam', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', 0)
ON DUPLICATE KEY UPDATE `ten_vi_tri`=VALUES(`ten_vi_tri`), `tinh_thanh`=VALUES(`tinh_thanh`), `hinh_anh`=VALUES(`hinh_anh`);

-- --------------------------------------------------------------
-- 3. DỮ LIỆU BẢNG PHONG (12 Căn Phòng Thực Tế Đầy Đủ Tiện Nghi)
-- --------------------------------------------------------------
INSERT INTO `Phong` (`id`, `ten_phong`, `khach`, `phong_ngu`, `giuong`, `phong_tam`, `mo_ta`, `gia_tien`, `may_giat`, `ban_la`, `tivi`, `dieu_hoa`, `wifi`, `bep`, `do_xe`, `ho_boi`, `ban_ui`, `hinh_anh`, `ma_vi_tri`, `isDeleted`) VALUES
(1, 'Penthouse Panorama View Bitexco', 4, 2, 2, 2, 'Căn hộ Penthouse cao cấp tầng 35 với tầm nhìn triệu đô bao trọn trung tâm Sài Gòn, sông Sài Gòn và tòa tháp Bitexco. Nội thất phong cách Scandinavian hiện đại, ban công rộng thoáng mát.', 2450000, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', 1, 0),
(2, 'Saigon Riverside Luxury Suite', 2, 1, 1, 1, 'Căn hộ studio sang trọng ngay ven sông Sài Gòn, trang bị đầy đủ bếp từ, máy pha cà phê, TV 65 inch 4K và hồ bơi vô cực trên tầng thượng.', 1250000, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', 1, 0),
(3, 'Boutique Loft Giữa Lòng Phố Cổ', 2, 1, 1, 1, 'Không gian đậm chất Hà Nội xưa kết hợp tiện nghi hiện đại, chỉ 3 phút đi bộ ra Hồ Hoàn Kiếm, phố đi bộ và chợ đêm. Phòng yên tĩnh, ánh sáng tự nhiên ngập tràn.', 850000, 1, 1, 1, 1, 1, 1, 0, 0, 1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', 2, 0),
(4, 'Heritage French Villa Apartment', 4, 2, 2, 1, 'Căn hộ kiến trúc Pháp cổ điển với trần nhà cao, ban công rợp bóng cây xanh mát mắt, không gian thư giãn lý tưởng cho gia đình và nhóm bạn.', 1400000, 1, 1, 1, 1, 1, 1, 1, 0, 1, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80', 2, 0),
(5, 'Pine Hill Wooden Chalet Giữa Rừng Thông', 4, 2, 2, 2, 'Căn nhà gỗ ấm cúng nép mình bên sườn đồi thông Đà Lạt thơ mộng, có lò sưởi, hiên uống trà ngắm hoàng hôn và view thung lũng sương mù cực chill.', 1650000, 1, 1, 1, 1, 1, 1, 1, 0, 1, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 3, 0),
(6, 'Cloud View Glasshouse Villa', 6, 3, 3, 2, 'Biệt thự kính săn mây tuyệt đẹp, sân vườn nướng BBQ ngoài trời, tầm nhìn 360 độ ngắm trọn bình minh và biển mây bồng bềnh mỗi sáng sớm.', 2800000, 1, 1, 1, 0, 1, 1, 1, 0, 1, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80', 3, 0),
(7, 'Oceanfront Luxury Suite Mỹ Khê', 2, 1, 1, 1, 'Phòng nghỉ dưỡng trực diện biển Mỹ Khê Đà Nẵng, cửa kính chạm trần đón gió biển trong lành, bồn tắm nằm view biển sang trọng chuẩn 5 sao.', 1850000, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', 4, 0),
(8, 'Modern Coastal Studio Ban Công View Biển', 3, 1, 2, 1, 'Studio thiết kế phong cách Địa Trung Hải tươi sáng, chỉ cách bãi tắm vài bước chân, có bể bơi ngoài trời và phòng tập gym miễn phí.', 950000, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', 4, 0),
(9, 'Panorama Sea View Condotel Vịnh Nha Trang', 4, 2, 2, 2, 'Căn hộ biển hướng vịnh Nha Trang trên cung đường Trần Phú sầm uất, nội thất cao cấp, hồ bơi vô cực và quầy bar tầng thượng ngắm toàn cảnh thành phố.', 1750000, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80', 5, 0),
(10, 'Sunset Beachfront Villa Hồ Bơi Riêng', 8, 4, 4, 4, 'Biệt thự nghỉ dưỡng thượng lưu sát biển Bãi Dài Phú Quốc, có hồ bơi riêng biệt lập, khu vườn nhiệt đới, quản gia riêng và lối đi thẳng ra bờ cát trắng mịn.', 4200000, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', 6, 0),
(11, 'An Bang Beach Garden Retreat', 4, 2, 2, 2, 'Homestay sân vườn rợp bóng dừa xanh ngay bãi biển An Bàng Hội An, không gian thanh bình, cung cấp xe đạp miễn phí dạo quanh phố cổ đèn lồng.', 1150000, 1, 1, 1, 1, 1, 1, 1, 0, 1, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', 7, 0),
(12, 'Seaside Balcony Condo Bãi Trước Vũng Tàu', 4, 2, 2, 1, 'Căn hộ ban công lộng gió ngắm trọn hoàng hôn Bãi Trước và ngọn hải đăng Vũng Tàu, vị trí đắc địa gần chợ hải sản và các quán cà phê view biển.', 990000, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80', 8, 0)
ON DUPLICATE KEY UPDATE `ten_phong`=VALUES(`ten_phong`), `gia_tien`=VALUES(`gia_tien`), `hinh_anh`=VALUES(`hinh_anh`), `mo_ta`=VALUES(`mo_ta`);

-- --------------------------------------------------------------
-- 4. DỮ LIỆU BẢNG DATPHONG (6 Lượt Đặt Phòng Mẫu Thực Tế)
-- --------------------------------------------------------------
INSERT INTO `DatPhong` (`id`, `ma_phong`, `ngay_den`, `ngay_di`, `so_luong_khach`, `ma_nguoi_dat`, `isDeleted`) VALUES
(1, 1, '2026-03-01 14:00:00', '2026-03-04 12:00:00', 2, 2, 0),
(2, 7, '2026-04-10 14:00:00', '2026-04-14 12:00:00', 2, 2, 0),
(3, 5, '2026-11-01 14:00:00', '2026-11-05 12:00:00', 2, 2, 0),
(4, 10, '2026-12-20 14:00:00', '2026-12-25 12:00:00', 4, 2, 0),
(5, 3, '2026-11-15 14:00:00', '2026-11-18 12:00:00', 2, 3, 0),
(6, 6, '2026-12-01 14:00:00', '2026-12-04 12:00:00', 3, 3, 0)
ON DUPLICATE KEY UPDATE `ngay_den`=VALUES(`ngay_den`), `ngay_di`=VALUES(`ngay_di`), `so_luong_khach`=VALUES(`so_luong_khach`);

-- --------------------------------------------------------------
-- 5. DỮ LIỆU BẢNG BINHLUAN (12 Đánh Giá Kèm Sao Thực Tế)
-- --------------------------------------------------------------
INSERT INTO `BinhLuan` (`id`, `ma_phong`, `ma_nguoi_binh_luan`, `ngay_binh_luan`, `noi_dung`, `sao_binh_luan`, `isDeleted`) VALUES
(1, 1, 2, '2026-03-05 09:30:00', 'Căn Penthouse thật sự đỉnh chóp! Ban công rộng ngắm Bitexco về đêm cực kỳ lãng mạn. Chủ nhà chu đáo, phòng sạch bóng.', 5, 0),
(2, 1, 3, '2026-03-15 18:20:00', 'Không gian sang trọng, nội thất chỉn chu từng chi tiết nhỏ. Vị trí ngay trung tâm đi đâu cũng tiện.', 5, 0),
(3, 3, 2, '2026-04-02 11:15:00', 'Vị trí siêu thuận lợi đi bộ ra Hồ Gươm chỉ vài phút. Phòng ấm cúng, thiết kế cổ điển mộc mạc đúng chất Hà Nội.', 5, 0),
(4, 3, 3, '2026-04-12 14:40:00', 'Phòng sạch sẽ, giường ngủ rất êm ái. Xung quanh nhiều quán ăn ngon nổi tiếng phố cổ.', 4, 0),
(5, 5, 2, '2026-05-01 08:00:00', 'Nhà gỗ giữa đồi thông không khí trong lành tuyệt đối. Buổi sáng uống trà ngắm mây sương bay ngang hiên nhà siêu thích!', 5, 0),
(6, 5, 3, '2026-05-20 16:30:00', 'Trải nghiệm nghỉ dưỡng tuyệt vời tại Đà Lạt. Decor gỗ thông ấm áp, có lò sưởi đốt củi rất chill.', 5, 0),
(7, 7, 2, '2026-06-10 10:10:00', 'Căn phòng ngắm biển Mỹ Khê xuất sắc! Bồn tắm view biển sống ảo tuyệt đẹp, đi bộ qua đường là chạm chân tới biển.', 5, 0),
(8, 7, 3, '2026-06-25 15:50:00', 'Dịch vụ chuẩn 5 sao, phòng ốc mới tinh thơm tho. Chắc chắn sẽ quay lại vào kỳ nghỉ tới!', 5, 0),
(9, 10, 2, '2026-07-08 20:00:00', 'Villa biệt lập hồ bơi riêng siêu đẹp, ngắm hoàng hôn Phú Quốc đẹp nao lòng. Gia đình mình có kỳ nghỉ rất trọn vẹn.', 5, 0),
(10, 10, 3, '2026-07-22 17:15:00', 'Không gian riêng tư, bãi cát trắng mịn ngay trước mặt. Đáng từng đồng tiền!', 5, 0),
(11, 11, 2, '2026-08-05 12:00:00', 'Khu vườn nhiệt đới xanh mát, đạp xe ra biển An Bàng chỉ mất 2 phút. Cô chú chủ nhà cực kỳ mến khách.', 5, 0),
(12, 12, 3, '2026-09-02 19:45:00', 'Căn hộ ban công đón gió biển lồng lộng, gần ngọn Hải Đăng và các quán hải sản tươi ngon. Giá cả rất hợp lý.', 4, 0)
ON DUPLICATE KEY UPDATE `noi_dung`=VALUES(`noi_dung`), `sao_binh_luan`=VALUES(`sao_binh_luan`);

SET FOREIGN_KEY_CHECKS = 1;
