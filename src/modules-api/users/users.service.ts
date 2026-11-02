import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationUserDto } from './dto/pagination-user.dto';
import { UploadService } from 'src/common/services/upload.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * 1. Lấy toàn bộ danh sách người dùng (chưa bị xóa mềm)
   */
  async findAll() {
    return this.prisma.nguoiDung.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birth_day: true,
        gender: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * 2. Tạo người dùng mới (Dành cho Admin)
   */
  async create(createUserDto: CreateUserDto) {
    const { email, password, name, phone, birthday, gender, role } = createUserDto;

    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email này đã được sử dụng!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let formattedGender = 'Nam';
    if (gender !== undefined && gender !== null) {
      if (gender === false || gender === 'false' || gender === 'Nữ' || gender === 'Nu') {
        formattedGender = 'Nữ';
      }
    }

    const newUser = await this.prisma.nguoiDung.create({
      data: {
        name,
        email,
        pass_word: hashedPassword,
        phone: phone || null,
        birth_day: birthday || null,
        gender: formattedGender,
        role: role?.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birth_day: true,
        gender: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    return {
      message: 'Tạo người dùng mới thành công!',
      content: newUser,
    };
  }

  /**
   * 3. Lấy thông tin chi tiết người dùng theo ID
   */
  async findOne(id: number) {
    const user = await this.prisma.nguoiDung.findFirst({
      where: { id, isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birth_day: true,
        gender: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng có ID: ${id}`);
    }

    return user;
  }

  /**
   * 4. Cập nhật thông tin người dùng
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Đảm bảo user tồn tại

    const { email, name, phone, birthday, gender, role } = updateUserDto;

    if (email) {
      const emailConflict = await this.prisma.nguoiDung.findFirst({
        where: {
          email,
          id: { not: id },
        },
      });
      if (emailConflict) {
        throw new ConflictException('Email này đã được sử dụng bởi tài khoản khác!');
      }
    }

    let formattedGender: string | undefined = undefined;
    if (gender !== undefined && gender !== null) {
      formattedGender =
        gender === false || gender === 'false' || gender === 'Nữ' || gender === 'Nu'
          ? 'Nữ'
          : 'Nam';
    }

    const updatedUser = await this.prisma.nguoiDung.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        email: email !== undefined ? email : undefined,
        phone: phone !== undefined ? phone : undefined,
        birth_day: birthday !== undefined ? birthday : undefined,
        gender: formattedGender,
        role: role !== undefined ? (role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER') : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birth_day: true,
        gender: true,
        role: true,
        avatar: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Cập nhật thông tin người dùng thành công!',
      content: updatedUser,
    };
  }

  /**
   * 5. Xóa người dùng (Xóa mềm để bảo toàn tính toàn vẹn dữ liệu)
   */
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.nguoiDung.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return {
      message: `Đã xóa thành công người dùng có ID: ${id}`,
      content: null,
    };
  }

  /**
   * 6. Tìm kiếm người dùng theo tên
   */
  async searchByName(name: string) {
    return this.prisma.nguoiDung.findMany({
      where: {
        isDeleted: false,
        name: {
          contains: name,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birth_day: true,
        gender: true,
        role: true,
        avatar: true,
      },
    });
  }

  /**
   * 7. Phân trang và tìm kiếm người dùng
   */
  async paginationSearch(query: PaginationUserDto) {
    const pageIndex = Number(query.pageIndex) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const keyword = query.keyword ? String(query.keyword).trim() : '';

    const skip = (pageIndex - 1) * pageSize;

    const whereCondition: any = {
      isDeleted: false,
    };

    if (keyword) {
      whereCondition.name = {
        contains: keyword,
      };
    }

    const [totalRow, data] = await Promise.all([
      this.prisma.nguoiDung.count({ where: whereCondition }),
      this.prisma.nguoiDung.findMany({
        where: whereCondition,
        skip,
        take: pageSize,
        orderBy: { id: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          birth_day: true,
          gender: true,
          role: true,
          avatar: true,
        },
      }),
    ]);

    return {
      pageIndex,
      pageSize,
      totalRow,
      keywords: keyword,
      data,
    };
  }

  /**
   * 8. Upload Avatar cho người dùng
   */
  async uploadAvatar(userId: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file hình ảnh đại diện!');
    }

    await this.findOne(userId);

    const avatarUrl = await this.uploadService.uploadImage(file, 'avatars');

    const updatedUser = await this.prisma.nguoiDung.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    return {
      message: 'Upload avatar thành công!',
      content: updatedUser,
    };
  }
}

