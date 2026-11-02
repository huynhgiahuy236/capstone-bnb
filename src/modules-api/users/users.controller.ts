import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationUserDto } from './dto/pagination-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('NguoiDung')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách người dùng' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  findAll() {
    return this.usersService.findAll();
  }

  @Public()
  @Get('phan-trang-tim-kiem')
  @ApiOperation({ summary: 'Phân trang và tìm kiếm người dùng theo từ khóa' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'keyword', required: false, type: String, example: '' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách phân trang thành công' })
  paginationSearch(@Query() query: PaginationUserDto) {
    return this.usersService.paginationSearch(query);
  }

  @Public()
  @Get('search/:TenNguoiDung')
  @ApiOperation({ summary: 'Tìm kiếm người dùng theo tên' })
  @ApiParam({ name: 'TenNguoiDung', type: String, example: 'Nam' })
  @ApiResponse({ status: 200, description: 'Tìm kiếm thành công' })
  searchByName(@Param('TenNguoiDung') tenNguoiDung: string) {
    return this.usersService.searchByName(tenNguoiDung);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một người dùng theo ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  @ApiBearerAuth('Bearer')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo người dùng mới (Yêu cầu quyền ADMIN)',
    description: 'Chỉ tài khoản ADMIN có token hợp lệ mới được quyền tạo người dùng.',
  })
  @ApiResponse({ status: 201, description: 'Tạo người dùng thành công' })
  @ApiResponse({ status: 403, description: 'Không đủ quyền truy cập (Yêu cầu ADMIN)' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng theo ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete()
  @Roles('ADMIN')
  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'Xóa người dùng theo ID (Query param ?id=...) (Yêu cầu ADMIN)',
  })
  @ApiQuery({ name: 'id', type: Number, required: true, example: 1 })
  @ApiResponse({ status: 200, description: 'Xóa người dùng thành công' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  remove(@Query('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Post('upload-avatar')
  @ApiBearerAuth('Bearer')
  @UseInterceptors(FileInterceptor('formFile'))
  @ApiOperation({
    summary: 'Upload avatar cho người dùng đang đăng nhập',
    description: 'Upload file hình ảnh đại diện (hỗ trợ lưu local & Cloudinary).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        formFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Upload avatar thành công' })
  uploadAvatar(
    @CurrentUser('id') userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(userId, file);
  }
}
