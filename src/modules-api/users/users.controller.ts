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
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PaginationUserDto } from "./dto/pagination-user.dto";
import { Public } from "src/common/decorators/public.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/current-user.decorator";

@ApiTags("NguoiDung")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Lấy toàn bộ danh sách người dùng" })
  @ApiResponse({
    status: 200,
    description: "Lấy toàn bộ danh sách người dùng thành công",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Public()
  @Get("phan-trang-tim-kiem")
  @ApiOperation({ summary: "Phân trang và tìm kiếm người dùng theo từ khóa" })
  @ApiQuery({ name: "pageIndex", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "pageSize", required: false, type: Number, example: 10 })
  @ApiQuery({ name: "keyword", required: false, type: String, example: "" })
  @ApiResponse({
    status: 200,
    description: "Lấy danh sách phân trang người dùng thành công",
  })
  @ApiResponse({ status: 400, description: "Tham số phân trang không hợp lệ" })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  paginationSearch(@Query() query: PaginationUserDto) {
    return this.usersService.paginationSearch(query);
  }

  @Public()
  @Get("search/:TenNguoiDung")
  @ApiOperation({ summary: "Tìm kiếm người dùng theo tên" })
  @ApiParam({ name: "TenNguoiDung", type: String, example: "Nam" })
  @ApiResponse({
    status: 200,
    description: "Tìm kiếm danh sách người dùng theo tên thành công",
  })
  @ApiResponse({
    status: 400,
    description: "Tên người dùng tìm kiếm không hợp lệ",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  searchByName(@Param("TenNguoiDung") tenNguoiDung: string) {
    return this.usersService.searchByName(tenNguoiDung);
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Lấy thông tin chi tiết một người dùng theo ID" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: "Lấy thông tin chi tiết người dùng thành công",
  })
  @ApiResponse({
    status: 400,
    description: "ID người dùng không hợp lệ (phải là số nguyên)",
  })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy người dùng có ID tương ứng hoặc đã bị xóa",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles("ADMIN")
  @ApiBearerAuth("Bearer")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Tạo người dùng mới (Yêu cầu quyền ADMIN)",
    description:
      "Chỉ tài khoản ADMIN có token hợp lệ mới được quyền tạo người dùng.",
  })
  @ApiResponse({ status: 201, description: "Tạo người dùng mới thành công" })
  @ApiResponse({
    status: 400,
    description: "Dữ liệu người dùng gửi lên không hợp lệ",
  })
  @ApiResponse({
    status: 401,
    description: "Chưa đăng nhập hoặc mã token không hợp lệ",
  })
  @ApiResponse({
    status: 403,
    description: "Không đủ quyền truy cập (Yêu cầu vai trò ADMIN)",
  })
  @ApiResponse({
    status: 409,
    description: "Email này đã được sử dụng bởi tài khoản khác",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(":id")
  @ApiBearerAuth("Bearer")
  @ApiOperation({ summary: "Cập nhật thông tin người dùng theo ID" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: "Cập nhật thông tin người dùng thành công",
  })
  @ApiResponse({ status: 400, description: "Dữ liệu cập nhật không hợp lệ" })
  @ApiResponse({
    status: 401,
    description: "Chưa đăng nhập hoặc mã token không hợp lệ",
  })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy người dùng có ID tương ứng",
  })
  @ApiResponse({
    status: 409,
    description: "Email mới cập nhật đã tồn tại trên hệ thống",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete()
  @Roles("ADMIN")
  @ApiBearerAuth("Bearer")
  @ApiOperation({
    summary: "Xóa người dùng theo ID (Query param ?id=...) (Yêu cầu ADMIN)",
  })
  @ApiQuery({ name: "id", type: Number, required: true, example: 1 })
  @ApiResponse({ status: 200, description: "Xóa người dùng thành công" })
  @ApiResponse({
    status: 400,
    description: "Thiếu query param ID hoặc ID không hợp lệ",
  })
  @ApiResponse({
    status: 401,
    description: "Chưa đăng nhập hoặc mã token không hợp lệ",
  })
  @ApiResponse({
    status: 403,
    description: "Không đủ quyền truy cập (Yêu cầu vai trò ADMIN)",
  })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy người dùng có ID tương ứng để xóa",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  remove(@Query("id", ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Post("upload-avatar")
  @ApiBearerAuth("Bearer")
  @UseInterceptors(FileInterceptor("formFile"))
  @ApiOperation({
    summary: "Upload avatar cho người dùng đang đăng nhập",
    description:
      "Upload file hình ảnh đại diện (hỗ trợ lưu local & Cloudinary).",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        formFile: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Upload avatar người dùng thành công",
  })
  @ApiResponse({
    status: 400,
    description: "Chưa chọn file hình ảnh hoặc file không đúng định dạng ảnh",
  })
  @ApiResponse({
    status: 401,
    description: "Chưa đăng nhập hoặc mã token không hợp lệ",
  })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy thông tin người dùng",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  uploadAvatar(
    @CurrentUser("id") userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(userId, file);
  }
}
