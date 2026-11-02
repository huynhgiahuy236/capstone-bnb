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
import { PhongService } from './phong.service';
import { CreatePhongDto } from './dto/create-phong.dto';
import { UpdatePhongDto } from './dto/update-phong.dto';
import { PaginationPhongDto } from './dto/pagination-phong.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Phong')
@Controller('phong-thue')
export class PhongController {
  constructor(private readonly phongService: PhongService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách phòng thuê' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  findAll() {
    return this.phongService.findAll();
  }

  @Public()
  @Get('lay-phong-theo-vi-tri')
  @ApiOperation({ summary: 'Lấy danh sách phòng theo mã vị trí' })
  @ApiQuery({ name: 'maViTri', type: Number, required: true, example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy danh sách theo vị trí thành công' })
  findByViTri(@Query('maViTri', ParseIntPipe) maViTri: number) {
    return this.phongService.findByViTri(maViTri);
  }

  @Public()
  @Get('phan-trang-tim-kiem')
  @ApiOperation({ summary: 'Phân trang tìm kiếm phòng thuê' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'keyword', required: false, type: String, example: '' })
  @ApiResponse({ status: 200, description: 'Phân trang thành công' })
  paginationSearch(@Query() query: PaginationPhongDto) {
    return this.phongService.paginationSearch(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một phòng theo ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy chi tiết phòng thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phòng' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.phongService.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  @ApiBearerAuth('Bearer')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Thêm phòng mới (Yêu cầu ADMIN)' })
  @ApiResponse({ status: 201, description: 'Thêm phòng thành công' })
  @ApiResponse({ status: 403, description: 'Không đủ quyền truy cập (Yêu cầu ADMIN)' })
  create(@Body() createPhongDto: CreatePhongDto) {
    return this.phongService.create(createPhongDto);
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Cập nhật thông tin phòng (Yêu cầu ADMIN)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Cập nhật phòng thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phòng' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePhongDto: UpdatePhongDto,
  ) {
    return this.phongService.update(id, updatePhongDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Xóa phòng theo ID (Yêu cầu ADMIN)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Xóa phòng thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phòng' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.phongService.remove(id);
  }

  @Post('upload-hinh-phong')
  @Roles('ADMIN')
  @ApiBearerAuth('Bearer')
  @UseInterceptors(FileInterceptor('formFile'))
  @ApiOperation({
    summary: 'Upload hình ảnh cho phòng (Yêu cầu ADMIN)',
    description: 'Upload file hình ảnh đại diện phòng thuê lên Cloudinary / Local.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'maPhong', type: Number, required: true, example: 1 })
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
  @ApiResponse({ status: 200, description: 'Upload hình phòng thành công' })
  uploadHinhPhong(
    @Query('maPhong', ParseIntPipe) maPhong: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.phongService.uploadHinhPhong(maPhong, file);
  }
}

