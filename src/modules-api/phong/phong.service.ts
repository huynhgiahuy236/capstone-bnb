import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { CreatePhongDto } from './dto/create-phong.dto';
import { UpdatePhongDto } from './dto/update-phong.dto';
import { PaginationPhongDto } from './dto/pagination-phong.dto';
import { UploadService } from 'src/common/services/upload.service';

@Injectable()
export class PhongService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * Chuyển đổi dữ liệu phòng từ snake_case DB sang camelCase theo đúng Swagger
   */
  private formatPhong(item: any) {
    if (!item) return null;
    return {
      id: item.id,
      tenPhong: item.ten_phong,
      khach: item.khach,
      phongNgu: item.phong_ngu,
      giuong: item.giuong,
      phongTam: item.phong_tam,
      moTa: item.mo_ta,
      giaTien: item.gia_tien,
      mayGiat: Boolean(item.may_giat),
      banLa: Boolean(item.ban_la),
      tivi: Boolean(item.tivi),
      dieuHoa: Boolean(item.dieu_hoa),
      wifi: Boolean(item.wifi),
      bep: Boolean(item.bep),
      doXe: Boolean(item.do_xe),
      hoBoi: Boolean(item.ho_boi),
      banUi: Boolean(item.ban_ui),
      maViTri: item.ma_vi_tri,
      hinhAnh: item.hinh_anh,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      viTri: item.ViTri
        ? {
            id: item.ViTri.id,
            tenViTri: item.ViTri.ten_vi_tri,
            tinhThanh: item.ViTri.tinh_thanh,
            quocGia: item.ViTri.quoc_gia,
          }
        : undefined,
    };
  }

  /**
   * 1. Lấy toàn bộ danh sách phòng thuê
   */
  async findAll() {
    const list = await this.prisma.phong.findMany({
      where: { isDeleted: false },
      include: { ViTri: true },
      orderBy: { id: 'desc' },
    });
    return list.map((item) => this.formatPhong(item));
  }

  /**
   * 2. Thêm phòng mới
   */
  async create(dto: CreatePhongDto) {
    if (dto.maViTri) {
      const viTri = await this.prisma.viTri.findFirst({
        where: { id: dto.maViTri, isDeleted: false },
      });
      if (!viTri) {
        throw new NotFoundException(`Không tìm thấy vị trí có ID: ${dto.maViTri} trên hệ thống!`);
      }
    }

    const newPhong = await this.prisma.phong.create({
      data: {
        ten_phong: dto.tenPhong,
        khach: dto.khach || 1,
        phong_ngu: dto.phongNgu || 1,
        giuong: dto.giuong || 1,
        phong_tam: dto.phongTam || 1,
        mo_ta: dto.moTa || null,
        gia_tien: dto.giaTien || 0,
        may_giat: dto.mayGiat ?? false,
        ban_la: dto.banLa ?? false,
        tivi: dto.tivi ?? false,
        dieu_hoa: dto.dieuHoa ?? false,
        wifi: dto.wifi ?? false,
        bep: dto.bep ?? false,
        do_xe: dto.doXe ?? false,
        ho_boi: dto.hoBoi ?? false,
        ban_ui: dto.banUi ?? false,
        ma_vi_tri: dto.maViTri || null,
        hinh_anh: dto.hinhAnh || null,
      },
      include: { ViTri: true },
    });

    return {
      message: 'Thêm phòng mới thành công!',
      content: this.formatPhong(newPhong),
    };
  }

  /**
   * 3. Lấy thông tin chi tiết một phòng theo ID
   */
  async findOne(id: number) {
    const phong = await this.prisma.phong.findFirst({
      where: { id, isDeleted: false },
      include: { ViTri: true },
    });

    if (!phong) {
      throw new NotFoundException(`Không tìm thấy phòng thuê có ID: ${id} hoặc phòng đã bị xóa!`);
    }

    return this.formatPhong(phong);
  }

  /**
   * 4. Lấy danh sách phòng theo mã vị trí
   */
  async findByViTri(maViTri: number) {
    const viTri = await this.prisma.viTri.findFirst({
      where: { id: maViTri, isDeleted: false },
    });
    if (!viTri) {
      throw new NotFoundException(`Không tìm thấy vị trí có ID: ${maViTri} trên hệ thống!`);
    }

    const list = await this.prisma.phong.findMany({
      where: {
        ma_vi_tri: maViTri,
        isDeleted: false,
      },
      include: { ViTri: true },
      orderBy: { id: 'desc' },
    });

    return list.map((item) => this.formatPhong(item));
  }

  /**
   * 5. Cập nhật thông tin phòng
   */
  async update(id: number, dto: UpdatePhongDto) {
    await this.findOne(id);

    if (dto.maViTri) {
      const viTri = await this.prisma.viTri.findFirst({
        where: { id: dto.maViTri, isDeleted: false },
      });
      if (!viTri) {
        throw new NotFoundException(`Không tìm thấy vị trí có ID: ${dto.maViTri} trên hệ thống!`);
      }
    }

    const updated = await this.prisma.phong.update({
      where: { id },
      data: {
        ten_phong: dto.tenPhong !== undefined ? dto.tenPhong : undefined,
        khach: dto.khach !== undefined ? dto.khach : undefined,
        phong_ngu: dto.phongNgu !== undefined ? dto.phongNgu : undefined,
        giuong: dto.giuong !== undefined ? dto.giuong : undefined,
        phong_tam: dto.phongTam !== undefined ? dto.phongTam : undefined,
        mo_ta: dto.moTa !== undefined ? dto.moTa : undefined,
        gia_tien: dto.giaTien !== undefined ? dto.giaTien : undefined,
        may_giat: dto.mayGiat !== undefined ? dto.mayGiat : undefined,
        ban_la: dto.banLa !== undefined ? dto.banLa : undefined,
        tivi: dto.tivi !== undefined ? dto.tivi : undefined,
        dieu_hoa: dto.dieuHoa !== undefined ? dto.dieuHoa : undefined,
        wifi: dto.wifi !== undefined ? dto.wifi : undefined,
        bep: dto.bep !== undefined ? dto.bep : undefined,
        do_xe: dto.doXe !== undefined ? dto.doXe : undefined,
        ho_boi: dto.hoBoi !== undefined ? dto.hoBoi : undefined,
        ban_ui: dto.banUi !== undefined ? dto.banUi : undefined,
        ma_vi_tri: dto.maViTri !== undefined ? dto.maViTri : undefined,
        hinh_anh: dto.hinhAnh !== undefined ? dto.hinhAnh : undefined,
      },
      include: { ViTri: true },
    });

    return {
      message: 'Cập nhật thông tin phòng thành công!',
      content: this.formatPhong(updated),
    };
  }

  /**
   * 6. Xóa phòng (Xóa mềm)
   */
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.phong.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return {
      message: `Đã xóa thành công phòng thuê có ID: ${id}`,
      content: null,
    };
  }

  /**
   * 7. Phân trang tìm kiếm phòng
   */
  async paginationSearch(query: PaginationPhongDto) {
    const pageIndex = Number(query.pageIndex) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const keyword = query.keyword ? String(query.keyword).trim() : '';

    const skip = (pageIndex - 1) * pageSize;

    const whereCondition: any = {
      isDeleted: false,
    };

    if (keyword) {
      whereCondition.ten_phong = {
        contains: keyword,
      };
    }

    const [totalRow, data] = await Promise.all([
      this.prisma.phong.count({ where: whereCondition }),
      this.prisma.phong.findMany({
        where: whereCondition,
        skip,
        take: pageSize,
        include: { ViTri: true },
        orderBy: { id: 'desc' },
      }),
    ]);

    return {
      pageIndex,
      pageSize,
      totalRow,
      keywords: keyword,
      data: data.map((item) => this.formatPhong(item)),
    };
  }

  /**
   * 8. Upload hình ảnh cho phòng
   */
  async uploadHinhPhong(maPhong: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file hình ảnh!');
    }

    await this.findOne(maPhong);

    const imageUrl = await this.uploadService.uploadImage(file, 'rooms');

    const updated = await this.prisma.phong.update({
      where: { id: maPhong },
      data: { hinh_anh: imageUrl },
      include: { ViTri: true },
    });

    return {
      message: 'Upload hình ảnh phòng thành công!',
      content: this.formatPhong(updated),
    };
  }
}
