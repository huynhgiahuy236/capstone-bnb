import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "src/modules-system/prisma/prisma.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { PaginationLocationDto } from "./dto/pagination-location.dto";
import { UploadService } from "src/common/services/upload.service";

@Injectable()
export class LocationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * Chuyển đổi dữ liệu từ DB (snake_case) sang Swagger format (camelCase)
   */
  private formatLocation(item: any) {
    if (!item) return null;
    return {
      id: item.id,
      tenViTri: item.ten_vi_tri,
      tinhThanh: item.tinh_thanh,
      quocGia: item.quoc_gia,
      hinhAnh: item.hinh_anh,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  /**
   * 1. Lấy toàn bộ danh sách vị trí
   */
  async findAll() {
    const list = await this.prisma.viTri.findMany({
      where: { isDeleted: false },
      orderBy: { id: "desc" },
    });
    return list.map((item) => this.formatLocation(item));
  }

  /**
   * 2. Thêm vị trí mới
   */
  async create(dto: CreateLocationDto) {
    const newLocation = await this.prisma.viTri.create({
      data: {
        ten_vi_tri: dto.tenViTri,
        tinh_thanh: dto.tinhThanh,
        quoc_gia: dto.quocGia || "Việt Nam",
        hinh_anh: dto.hinhAnh || null,
      },
    });

    return {
      message: "Thêm vị trí mới thành công!",
      content: this.formatLocation(newLocation),
    };
  }

  /**
   * 3. Lấy thông tin chi tiết một vị trí theo ID
   */
  async findOne(id: number) {
    const location = await this.prisma.viTri.findFirst({
      where: { id, isDeleted: false },
    });

    if (!location) {
      throw new NotFoundException(
        `Không tìm thấy vị trí có ID: ${id} hoặc vị trí đã bị xóa!`,
      );
    }

    return this.formatLocation(location);
  }

  /**
   * 4. Cập nhật vị trí
   */
  async update(id: number, dto: UpdateLocationDto) {
    await this.findOne(id);

    const updated = await this.prisma.viTri.update({
      where: { id },
      data: {
        ten_vi_tri: dto.tenViTri !== undefined ? dto.tenViTri : undefined,
        tinh_thanh: dto.tinhThanh !== undefined ? dto.tinhThanh : undefined,
        quoc_gia: dto.quocGia !== undefined ? dto.quocGia : undefined,
        hinh_anh: dto.hinhAnh !== undefined ? dto.hinhAnh : undefined,
      },
    });

    return {
      message: "Cập nhật vị trí thành công!",
      content: this.formatLocation(updated),
    };
  }

  /**
   * 5. Xóa vị trí (Xóa mềm)
   */
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.viTri.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return {
      message: `Đã xóa thành công vị trí có ID: ${id}`,
      content: null,
    };
  }

  /**
   * 6. Phân trang tìm kiếm vị trí
   */
  async paginationSearch(query: PaginationLocationDto) {
    const pageIndex = Number(query.pageIndex) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const keyword = query.keyword ? String(query.keyword).trim() : "";

    const skip = (pageIndex - 1) * pageSize;

    const whereCondition: any = {
      isDeleted: false,
    };

    if (keyword) {
      whereCondition.OR = [
        { ten_vi_tri: { contains: keyword } },
        { tinh_thanh: { contains: keyword } },
      ];
    }

    const [totalRow, data] = await Promise.all([
      this.prisma.viTri.count({ where: whereCondition }),
      this.prisma.viTri.findMany({
        where: whereCondition,
        skip,
        take: pageSize,
        orderBy: { id: "desc" },
      }),
    ]);

    return {
      pageIndex,
      pageSize,
      totalRow,
      keywords: keyword,
      data: data.map((item) => this.formatLocation(item)),
    };
  }

  /**
   * 7. Upload hình ảnh cho vị trí
   */
  async uploadLocationImage(maViTri: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("Vui lòng chọn file hình ảnh!");
    }

    await this.findOne(maViTri);

    const imageUrl = await this.uploadService.uploadImage(file, "locations");

    const updated = await this.prisma.viTri.update({
      where: { id: maViTri },
      data: { hinh_anh: imageUrl },
    });

    return {
      message: "Upload hình ảnh vị trí thành công!",
      content: this.formatLocation(updated),
    };
  }
}
