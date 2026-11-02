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
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DatPhongService } from './dat-phong.service';
import { CreateDatPhongDto } from './dto/create-dat-phong.dto';
import { UpdateDatPhongDto } from './dto/update-dat-phong.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('DatPhong')
@Controller('dat-phong')
export class DatPhongController {
  constructor(private readonly datPhongService: DatPhongService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách đặt phòng' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  findAll() {
    return this.datPhongService.findAll();
  }

  @Public()
  @Get('lay-theo-nguoi-dung/:MaNguoiDung')
  @ApiOperation({ summary: 'Lấy danh sách đặt phòng theo mã người dùng' })
  @ApiParam({ name: 'MaNguoiDung', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  findByUser(@Param('MaNguoiDung', ParseIntPipe) maNguoiDung: number) {
    return this.datPhongService.findByUser(maNguoiDung);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một đơn đặt phòng theo ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy chi tiết thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn đặt phòng' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.datPhongService.findOne(id);
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo đơn đặt phòng mới' })
  @ApiResponse({ status: 201, description: 'Đặt phòng thành công' })
  @ApiResponse({ status: 400, description: 'Ngày đi phải sau ngày đến' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phòng hoặc người dùng' })
  create(@Body() createDatPhongDto: CreateDatPhongDto) {
    return this.datPhongService.create(createDatPhongDto);
  }

  @Public()
  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin đơn đặt phòng' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn đặt phòng' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDatPhongDto: UpdateDatPhongDto,
  ) {
    return this.datPhongService.update(id, updateDatPhongDto);
  }

  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Hủy đơn đặt phòng theo ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Hủy đặt phòng thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn đặt phòng' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.datPhongService.remove(id);
  }
}
