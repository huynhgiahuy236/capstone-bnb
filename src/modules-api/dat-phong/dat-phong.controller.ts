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
  @ApiResponse({ status: 200, description: 'Lấy toàn bộ danh sách đặt phòng thành công' })
  @ApiResponse({ status: 500, description: 'Lỗi máy chủ nội bộ (Internal Server Error)' })
  findAll() {
    return this.datPhongService.findAll();
  }

  @Public()
  @Get('lay-theo-nguoi-dung/:MaNguoiDung')
  @ApiOperation({ summary: 'Lấy danh sách đặt phòng theo mã người dùng' })
  @ApiParam({ name: 'MaNguoiDung', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy danh sách đặt phòng của người dùng thành công' })
  @ApiResponse({ status: 400, description: 'Mã người dùng không hợp lệ (phải là số nguyên)' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng có ID tương ứng trên hệ thống' })
  @ApiResponse({ status: 500, description: 'Lỗi máy chủ nội bộ (Internal Server Error)' })
  findByUser(@Param('MaNguoiDung', ParseIntPipe) maNguoiDung: number) {
    return this.datPhongService.findByUser(maNguoiDung);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một đơn đặt phòng theo ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy thông tin chi tiết đơn đặt phòng thành công' })
  @ApiResponse({ status: 400, description: 'ID đặt phòng không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn đặt phòng có ID tương ứng hoặc đã bị hủy' })
  @ApiResponse({ status: 500, description: 'Lỗi máy chủ nội bộ (Internal Server Error)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.datPhongService.findOne(id);
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo đơn đặt phòng mới' })
  @ApiResponse({ status: 201, description: 'Tạo đơn đặt phòng mới thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu đặt phòng không hợp lệ hoặc ngày đi (check-out) trước ngày đến' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phòng thuê hoặc người dùng liên kết trên hệ thống' })
  @ApiResponse({ status: 500, description: 'Lỗi máy chủ nội bộ (Internal Server Error)' })
  create(@Body() createDatPhongDto: CreateDatPhongDto) {
    return this.datPhongService.create(createDatPhongDto);
  }

  @Public()
  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin đơn đặt phòng' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Cập nhật đơn đặt phòng thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu cập nhật không hợp lệ hoặc ngày đi trước ngày đến' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn đặt phòng, phòng hoặc người dùng liên kết' })
  @ApiResponse({ status: 500, description: 'Lỗi máy chủ nội bộ (Internal Server Error)' })
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
  @ApiResponse({ status: 200, description: 'Hủy đơn đặt phòng thành công' })
  @ApiResponse({ status: 400, description: 'ID đặt phòng không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn đặt phòng có ID tương ứng để hủy' })
  @ApiResponse({ status: 500, description: 'Lỗi máy chủ nội bộ (Internal Server Error)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.datPhongService.remove(id);
  }
}
