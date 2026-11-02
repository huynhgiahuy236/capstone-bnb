import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { BinhLuanService } from './binh-luan.service';
import { CreateBinhLuanDto } from './dto/create-binh-luan.dto';
import { UpdateBinhLuanDto } from './dto/update-binh-luan.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('BinhLuan')
@Controller('binh-luan')
export class BinhLuanController {
  constructor(private readonly binhLuanService: BinhLuanService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách bình luận' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  findAll() {
    return this.binhLuanService.findAll();
  }

  @Public()
  @Get('lay-binh-luan-theo-phong/:MaPhong')
  @ApiOperation({ summary: 'Lấy danh sách bình luận theo phòng' })
  @ApiParam({ name: 'MaPhong', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy bình luận theo phòng thành công' })
  findByPhong(@Param('MaPhong', ParseIntPipe) maPhong: number) {
    return this.binhLuanService.findByPhong(maPhong);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một bình luận theo ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy chi tiết thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bình luận' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.binhLuanService.findOne(id);
  }

  @Post()
  @ApiBearerAuth('Bearer')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Thêm bình luận mới (Yêu cầu đăng nhập)',
    description: 'Người dùng gửi bình luận và đánh giá số sao (1-5) cho phòng thuê.',
  })
  @ApiResponse({ status: 201, description: 'Thêm bình luận thành công' })
  @ApiResponse({ status: 401, description: 'Yêu cầu token xác thực' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phòng hoặc người dùng' })
  create(@Body() createBinhLuanDto: CreateBinhLuanDto) {
    return this.binhLuanService.create(createBinhLuanDto);
  }

  @Put(':id')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Chỉnh sửa bình luận (Yêu cầu đăng nhập)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bình luận' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBinhLuanDto: UpdateBinhLuanDto,
  ) {
    return this.binhLuanService.update(id, updateBinhLuanDto);
  }

  @Delete(':id')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Xóa bình luận theo ID (Yêu cầu đăng nhập)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Xóa bình luận thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bình luận' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.binhLuanService.remove(id);
  }
}
