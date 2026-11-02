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
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { Public } from "src/common/decorators/public.decorator";

@ApiTags("DatPhong")
@Controller("dat-phong")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Lấy toàn bộ danh sách đặt phòng" })
  @ApiResponse({
    status: 200,
    description: "Lấy toàn bộ danh sách đặt phòng thành công",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  findAll() {
    return this.bookingService.findAll();
  }

  @Public()
  @Get("lay-theo-nguoi-dung/:MaNguoiDung")
  @ApiOperation({ summary: "Lấy danh sách đặt phòng theo mã người dùng" })
  @ApiParam({ name: "MaNguoiDung", type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: "Lấy danh sách đặt phòng của người dùng thành công",
  })
  @ApiResponse({
    status: 400,
    description: "Mã người dùng không hợp lệ (phải là số nguyên)",
  })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy người dùng có ID tương ứng trên hệ thống",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  findByUser(@Param("MaNguoiDung", ParseIntPipe) maNguoiDung: number) {
    return this.bookingService.findByUser(maNguoiDung);
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Lấy thông tin chi tiết một đơn đặt phòng theo ID" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: "Lấy thông tin chi tiết đơn đặt phòng thành công",
  })
  @ApiResponse({ status: 400, description: "ID đặt phòng không hợp lệ" })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy đơn đặt phòng có ID tương ứng hoặc đã bị hủy",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.bookingService.findOne(id);
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Tạo đơn đặt phòng mới" })
  @ApiResponse({ status: 201, description: "Tạo đơn đặt phòng mới thành công" })
  @ApiResponse({
    status: 400,
    description:
      "Dữ liệu đặt phòng không hợp lệ hoặc ngày đi (check-out) trước ngày đến",
  })
  @ApiResponse({
    status: 404,
    description:
      "Không tìm thấy phòng thuê hoặc người dùng liên kết trên hệ thống",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Public()
  @Put(":id")
  @ApiOperation({ summary: "Cập nhật thông tin đơn đặt phòng" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: "Cập nhật đơn đặt phòng thành công",
  })
  @ApiResponse({
    status: 400,
    description: "Dữ liệu cập nhật không hợp lệ hoặc ngày đi trước ngày đến",
  })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy đơn đặt phòng, phòng hoặc người dùng liên kết",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Public()
  @Delete(":id")
  @ApiOperation({ summary: "Hủy đơn đặt phòng theo ID" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @ApiResponse({ status: 200, description: "Hủy đơn đặt phòng thành công" })
  @ApiResponse({ status: 400, description: "ID đặt phòng không hợp lệ" })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy đơn đặt phòng có ID tương ứng để hủy",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.bookingService.remove(id);
  }
}
