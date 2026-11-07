import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../modules-system/prisma/prisma.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Định dạng dữ liệu đặt phòng theo chuẩn Swagger (camelCase)
   */
  private formatBooking(item: any) {
    if (!item) return null;
    return {
      id: item.id,
      maPhong: item.ma_phong,
      ngayDen: item.ngay_den,
      ngayDi: item.ngay_di,
      soLuongKhach: item.so_luong_khach,
      maNguoiDung: item.ma_nguoi_dat,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      phong: item.Phong
        ? {
            id: item.Phong.id,
            tenPhong: item.Phong.ten_phong,
            giaTien: item.Phong.gia_tien,
            hinhAnh: item.Phong.hinh_anh,
          }
        : undefined,
      nguoiDat: item.NguoiDung
        ? {
            id: item.NguoiDung.id,
            name: item.NguoiDung.name,
            email: item.NguoiDung.email,
          }
        : undefined,
    };
  }

  /**
   * 1. Lấy toàn bộ danh sách đặt phòng
   */
  async findAll() {
    const list = await this.prisma.datPhong.findMany({
      where: { isDeleted: false },
      include: {
        Phong: true,
        NguoiDung: true,
      },
      orderBy: { id: "desc" },
    });
    return list.map((item) => this.formatBooking(item));
  }

  /**
   * 2. Đặt phòng mới
   */
  async create(dto: CreateBookingDto) {
    // 1. Kiểm tra phòng tồn tại
    const phong = await this.prisma.phong.findFirst({
      where: { id: dto.maPhong, isDeleted: false },
    });
    if (!phong) {
      throw new NotFoundException(
        `Không tìm thấy phòng thuê có ID: ${dto.maPhong} hoặc phòng đã bị xóa!`,
      );
    }

    // 2. Kiểm tra người dùng tồn tại
    const nguoiDung = await this.prisma.nguoiDung.findFirst({
      where: { id: dto.maNguoiDung, isDeleted: false },
    });
    if (!nguoiDung) {
      throw new NotFoundException(
        `Không tìm thấy người dùng có ID: ${dto.maNguoiDung} hoặc người dùng đã bị xóa!`,
      );
    }

    // 3. Kiểm tra số lượng khách với sức chứa phòng
    const guestCount = dto.soLuongKhach || 1;
    if (guestCount < 1) {
      throw new BadRequestException("Số lượng khách tối thiểu là 1!");
    }
    if (phong.khach && guestCount > phong.khach) {
      throw new BadRequestException(
        `Số lượng khách (${guestCount}) vượt quá sức chứa tối đa của phòng (${phong.khach} khách)!`,
      );
    }

    // 4. Kiểm tra tính hợp lệ của ngày đến và ngày đi
    const checkIn = new Date(dto.ngayDen);
    const checkOut = new Date(dto.ngayDi);
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      throw new BadRequestException(
        "Định dạng ngày đến hoặc ngày đi không hợp lệ!",
      );
    }
    if (checkOut <= checkIn) {
      throw new BadRequestException(
        "Ngày đi (check-out) phải diễn ra sau ngày đến (check-in) ít nhất 1 đêm!",
      );
    }

    // 5. Kiểm tra ngày nhận không nằm trong quá khứ (theo giờ VN GMT+7)
    const vnNow = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const vnTodayString = vnNow.toISOString().slice(0, 10);
    const checkInVn = new Date(checkIn.getTime() + 7 * 60 * 60 * 1000);
    const checkInVnString = checkInVn.toISOString().slice(0, 10);

    if (checkInVnString < vnTodayString) {
      throw new BadRequestException(
        "Ngày nhận phòng (check-in) không thể nằm trong quá khứ!",
      );
    }

    // 6. Kiểm tra xung đột trùng lịch phòng (Airbnb standard overlap)
    const conflictingBooking = await this.prisma.datPhong.findFirst({
      where: {
        ma_phong: dto.maPhong,
        isDeleted: false,
        ngay_den: { lt: checkOut },
        ngay_di: { gt: checkIn },
      },
    });
    if (conflictingBooking) {
      throw new BadRequestException(
        "Phòng đã có khách đặt trong khoảng thời gian này. Vui lòng chọn khoảng ngày khác!",
      );
    }

    const newBooking = await this.prisma.datPhong.create({
      data: {
        ma_phong: dto.maPhong,
        ngay_den: checkIn,
        ngay_di: checkOut,
        so_luong_khach: guestCount,
        ma_nguoi_dat: dto.maNguoiDung,
      },
      include: {
        Phong: true,
        NguoiDung: true,
      },
    });

    return {
      message: "Đặt phòng thành công!",
      content: this.formatBooking(newBooking),
    };
  }

  /**
   * 3. Lấy thông tin đặt phòng theo ID
   */
  async findOne(id: number) {
    const booking = await this.prisma.datPhong.findFirst({
      where: { id, isDeleted: false },
      include: {
        Phong: true,
        NguoiDung: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(
        `Không tìm thấy đơn đặt phòng có ID: ${id} hoặc đơn đã bị hủy!`,
      );
    }

    return this.formatBooking(booking);
  }

  /**
   * 4. Cập nhật thông tin đặt phòng
   */
  async update(id: number, dto: UpdateBookingDto) {
    const existing = await this.prisma.datPhong.findFirst({
      where: { id, isDeleted: false },
      include: { Phong: true },
    });
    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy đơn đặt phòng có ID: ${id} hoặc đơn đã bị hủy!`,
      );
    }

    const targetRoomId =
      dto.maPhong !== undefined ? dto.maPhong : existing.ma_phong;
    let targetRoom = existing.Phong;

    if (dto.maPhong && dto.maPhong !== existing.ma_phong) {
      const room = await this.prisma.phong.findFirst({
        where: { id: dto.maPhong, isDeleted: false },
      });
      if (!room) {
        throw new NotFoundException(
          `Không tìm thấy phòng thuê có ID: ${dto.maPhong} hoặc phòng đã bị xóa!`,
        );
      }
      targetRoom = room;
    }

    if (dto.maNguoiDung) {
      const user = await this.prisma.nguoiDung.findFirst({
        where: { id: dto.maNguoiDung, isDeleted: false },
      });
      if (!user) {
        throw new NotFoundException(
          `Không tìm thấy người dùng có ID: ${dto.maNguoiDung} hoặc người dùng đã bị xóa!`,
        );
      }
    }

    const checkIn = dto.ngayDen ? new Date(dto.ngayDen) : existing.ngay_den;
    const checkOut = dto.ngayDi ? new Date(dto.ngayDi) : existing.ngay_di;

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      throw new BadRequestException(
        "Định dạng ngày đến hoặc ngày đi không hợp lệ!",
      );
    }
    if (checkOut <= checkIn) {
      throw new BadRequestException(
        "Ngày đi (check-out) phải diễn ra sau ngày đến (check-in) ít nhất 1 đêm!",
      );
    }

    const guestCount =
      dto.soLuongKhach !== undefined
        ? dto.soLuongKhach
        : existing.so_luong_khach;
    if (guestCount < 1) {
      throw new BadRequestException("Số lượng khách tối thiểu là 1!");
    }
    if (targetRoom && targetRoom.khach && guestCount > targetRoom.khach) {
      throw new BadRequestException(
        `Số lượng khách (${guestCount}) vượt quá sức chứa tối đa của phòng (${targetRoom.khach} khách)!`,
      );
    }

    // Kiểm tra trùng lịch (loại trừ chính đơn đặt phòng đang cập nhật)
    const conflictingBooking = await this.prisma.datPhong.findFirst({
      where: {
        id: { not: id },
        ma_phong: targetRoomId,
        isDeleted: false,
        ngay_den: { lt: checkOut },
        ngay_di: { gt: checkIn },
      },
    });
    if (conflictingBooking) {
      throw new BadRequestException(
        "Phòng đã có khách đặt trong khoảng thời gian này. Vui lòng chọn khoảng ngày khác!",
      );
    }

    const updated = await this.prisma.datPhong.update({
      where: { id },
      data: {
        ma_phong: dto.maPhong !== undefined ? dto.maPhong : undefined,
        ngay_den: dto.ngayDen ? checkIn : undefined,
        ngay_di: dto.ngayDi ? checkOut : undefined,
        so_luong_khach:
          dto.soLuongKhach !== undefined ? dto.soLuongKhach : undefined,
        ma_nguoi_dat:
          dto.maNguoiDung !== undefined ? dto.maNguoiDung : undefined,
      },
      include: {
        Phong: true,
        NguoiDung: true,
      },
    });

    return {
      message: "Cập nhật đơn đặt phòng thành công!",
      content: this.formatBooking(updated),
    };
  }

  /**
   * 5. Xóa đơn đặt phòng (Xóa mềm)
   */
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.datPhong.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return {
      message: `Đã hủy đơn đặt phòng có ID: ${id}`,
      content: null,
    };
  }

  /**
   * 6. Lấy danh sách đặt phòng theo người dùng
   */
  async findByUser(maNguoiDung: number) {
    const user = await this.prisma.nguoiDung.findFirst({
      where: { id: maNguoiDung, isDeleted: false },
    });
    if (!user) {
      throw new NotFoundException(
        `Không tìm thấy người dùng có ID: ${maNguoiDung} hoặc người dùng đã bị xóa!`,
      );
    }

    const list = await this.prisma.datPhong.findMany({
      where: {
        ma_nguoi_dat: maNguoiDung,
        isDeleted: false,
      },
      include: {
        Phong: true,
        NguoiDung: true,
      },
      orderBy: { id: "desc" },
    });

    return list.map((item) => this.formatBooking(item));
  }
}
