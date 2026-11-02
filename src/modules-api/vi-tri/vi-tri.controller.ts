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
import { ViTriService } from './vi-tri.service';
import { CreateViTriDto } from './dto/create-vi-tri.dto';
import { UpdateViTriDto } from './dto/update-vi-tri.dto';
import { PaginationViTriDto } from './dto/pagination-vi-tri.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('ViTri')
@Controller('vi-tri')
export class ViTriController {
  constructor(private readonly viTriService: ViTriService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách vị trí' })
  @ApiResponse({ status: 200, description: 'Lấy toàn bộ danh sách vị trí thành công' })
  @ApiResponse({ status: 500, description: 'Lỗi máy chủ nội bộ (Internal Server Error)' })
  findAll() {
    return this.viTriService.findAll();
  }

  @Public()
  @Get('phan-trang-tim-kiem')
  @ApiOperation({ summary: 'Phân trang tìm kiếm vị trí theo từ khóa' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'keyword', required: false, type: String, example: '' })
  @ApiResponse({ status: 200, description: 'Phân trang tìm kiếm vị trí thành công' })
  @ApiResponse({ status: 400, description: 'Tham số phân trang không hợp lệ' })
  @ApiResponse({ status: 500, description: 'Lỗi máy chủ nội bộ (Internal Server Error)' })
  paginationSearch(@Query() query: PaginationViTriDto) {
    return this.viTriService.paginationSearch(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một vị trí theo ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy chi tiết vị trí thành công' })
  @ApiResponse({ status: 400, description: 'ID vị trí không hợp lệ (phải là số nguyên)' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vị trí có ID tương ứng hoặc đã bị xóa' })
  @ApiResponse({ status: 500, description: 'Lỗi máy chủ nội bộ (Internal Server Error)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.viTriService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  @ApiBearerAuth('Bearer')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Thêm vị trí mới (Yêu cầu ADMIN)' })
  @ApiResponse({ status: 201, description: 'Tạo vị trí mới thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu vị trí gửi lên không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập hoặc mã token không hợp lệ' })
  @ApiResponse({ status: 403, description: 'Không đủ quyền truy cập (Yêu cầu vai trò ADMIN)' })
  @ApiResponse({ status: 500, description: 'Lỗi máy chủ nội bộ (Internal Server Error)' })
  create(@Body() createViTriDto: CreateViTriDto) {
    return this.viTriService.create(createViTriDto);
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Cập nhật thông tin vị trí (Yêu cầu ADMIN)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Cập nhật vị trí thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu cập nhật hoặc ID vị trí không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập hoặc mã token không hợp lệ' })
  @ApiResponse({ status: 403, description: 'Không đủ quyền truy cập (Yêu cầu vai trò ADMIN)' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vị trí có ID tương ứng để cập nhật' })
  @ApiResponse({ status: 500, description: 'Lỗi máy chủ nội bộ (Internal Server Error)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateViTriDto: UpdateViTriDto,
  ) {
    return this.viTriService.update(id, updateViTriDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Xóa vị trí theo ID (Yêu cầu ADMIN)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Xóa vị trí thành công' })
  @ApiResponse({ status: 400, description: 'ID vị trí không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập hoặc mã token không hợp lệ' })
  @ApiResponse({ status: 403, description: 'Không đủ quyền truy cập (Yêu cầu vai trò ADMIN)' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vị trí có ID tương ứng để xóa' })
  @ApiResponse({ status: 500, description: 'Lỗi máy chủ nội bộ (Internal Server Error)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.viTriService.remove(id);
  }

  @Post('upload-hinh-vitri')
  @Roles('ADMIN')
  @ApiBearerAuth('Bearer')
  @UseInterceptors(FileInterceptor('formFile'))
  @ApiOperation({
    summary: 'Upload hình ảnh cho vị trí (Yêu cầu ADMIN)',
    description: 'Upload file hình ảnh đại diện vị trí lên Cloudinary / Local.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'maViTri', type: Number, required: true, example: 1 })
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
  @ApiResponse({ status: 200, description: 'Upload hình vị trí thành công' })
  @ApiResponse({ status: 400, description: 'Chưa chọn file hình ảnh hoặc file không đúng định dạng' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập hoặc mã token không hợp lệ' })
  @ApiResponse({ status: 403, description: 'Không đủ quyền truy cập (Yêu cầu vai trò ADMIN)' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vị trí có mã tương ứng' })
  @ApiResponse({ status: 500, description: 'Lỗi máy chủ nội bộ (Internal Server Error)' })
  uploadHinhViTri(
    @Query('maViTri', ParseIntPipe) maViTri: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.viTriService.uploadHinhViTri(maViTri, file);
  }
}
