import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/modules-system/prisma/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Định dạng dữ liệu bình luận theo chuẩn Swagger (camelCase)
   */
  private formatComment(item: any) {
    if (!item) return null;
    return {
      id: item.id,
      maPhong: item.ma_phong,
      maNguoiBinhLuan: item.ma_nguoi_binh_luan,
      ngayBinhLuan: item.ngay_binh_luan,
      noiDung: item.noi_dung,
      saoBinhLuan: item.sao_binh_luan,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      nguoiBinhLuan: item.NguoiDung
        ? {
            id: item.NguoiDung.id,
            name: item.NguoiDung.name,
            avatar: item.NguoiDung.avatar,
          }
        : undefined,
      phong: item.Phong
        ? {
            id: item.Phong.id,
            tenPhong: item.Phong.ten_phong,
          }
        : undefined,
    };
  }

  /**
   * 1. Lấy toàn bộ danh sách bình luận
   */
  async findAll() {
    const list = await this.prisma.binhLuan.findMany({
      where: { isDeleted: false },
      include: {
        NguoiDung: true,
        Phong: true,
      },
      orderBy: { id: "desc" },
    });
    return list.map((item) => this.formatComment(item));
  }

  /**
   * 2. Thêm bình luận mới
   */
  async create(dto: CreateCommentDto) {
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
    const user = await this.prisma.nguoiDung.findFirst({
      where: { id: dto.maNguoiBinhLuan, isDeleted: false },
    });
    if (!user) {
      throw new NotFoundException(
        `Không tìm thấy người dùng có ID: ${dto.maNguoiBinhLuan} hoặc người dùng đã bị xóa!`,
      );
    }

    const newComment = await this.prisma.binhLuan.create({
      data: {
        ma_phong: dto.maPhong,
        ma_nguoi_binh_luan: dto.maNguoiBinhLuan,
        noi_dung: dto.noiDung,
        sao_binh_luan: dto.saoBinhLuan,
        ngay_binh_luan: dto.ngayBinhLuan
          ? new Date(dto.ngayBinhLuan)
          : new Date(),
      },
      include: {
        NguoiDung: true,
        Phong: true,
      },
    });

    return {
      message: "Thêm bình luận thành công!",
      content: this.formatComment(newComment),
    };
  }

  /**
   * 3. Lấy thông tin chi tiết một bình luận theo ID
   */
  async findOne(id: number) {
    const comment = await this.prisma.binhLuan.findFirst({
      where: { id, isDeleted: false },
      include: {
        NguoiDung: true,
        Phong: true,
      },
    });

    if (!comment) {
      throw new NotFoundException(
        `Không tìm thấy bình luận có ID: ${id} hoặc bình luận đã bị xóa!`,
      );
    }

    return this.formatComment(comment);
  }

  /**
   * 4. Cập nhật bình luận
   */
  async update(id: number, dto: UpdateCommentDto) {
    await this.findOne(id);

    const updated = await this.prisma.binhLuan.update({
      where: { id },
      data: {
        noi_dung: dto.noiDung !== undefined ? dto.noiDung : undefined,
        sao_binh_luan:
          dto.saoBinhLuan !== undefined ? dto.saoBinhLuan : undefined,
      },
      include: {
        NguoiDung: true,
        Phong: true,
      },
    });

    return {
      message: "Cập nhật bình luận thành công!",
      content: this.formatComment(updated),
    };
  }

  /**
   * 5. Xóa bình luận (Xóa mềm)
   */
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.binhLuan.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return {
      message: `Đã xóa bình luận có ID: ${id}`,
      content: null,
    };
  }

  /**
   * 6. Lấy danh sách bình luận theo phòng
   */
  async findByRoom(maPhong: number) {
    const phong = await this.prisma.phong.findFirst({
      where: { id: maPhong, isDeleted: false },
    });
    if (!phong) {
      throw new NotFoundException(
        `Không tìm thấy phòng thuê có ID: ${maPhong} trên hệ thống!`,
      );
    }

    const list = await this.prisma.binhLuan.findMany({
      where: {
        ma_phong: maPhong,
        isDeleted: false,
      },
      include: {
        NguoiDung: true,
        Phong: true,
      },
      orderBy: { id: "desc" },
    });

    return list.map((item) => this.formatComment(item));
  }
}
