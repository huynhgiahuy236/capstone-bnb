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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Public } from "../../common/decorators/public.decorator";

@ApiTags("BinhLuan")
@Controller("binh-luan")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Lấy toàn bộ danh sách bình luận" })
  @ApiResponse({
    status: 200,
    description: "Lấy toàn bộ danh sách bình luận thành công",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  findAll() {
    return this.commentService.findAll();
  }

  @Public()
  @Get("lay-binh-luan-theo-phong/:MaPhong")
  @ApiOperation({ summary: "Lấy danh sách bình luận theo phòng" })
  @ApiParam({ name: "MaPhong", type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: "Lấy danh sách bình luận theo phòng thành công",
  })
  @ApiResponse({
    status: 400,
    description: "Mã phòng không hợp lệ (phải là số nguyên)",
  })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy phòng thuê có ID tương ứng trên hệ thống",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  findByRoom(@Param("MaPhong", ParseIntPipe) maPhong: number) {
    return this.commentService.findByRoom(maPhong);
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Lấy thông tin chi tiết một bình luận theo ID" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: "Lấy thông tin chi tiết bình luận thành công",
  })
  @ApiResponse({ status: 400, description: "ID bình luận không hợp lệ" })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy bình luận có ID tương ứng hoặc đã bị xóa",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.commentService.findOne(id);
  }

  @Post()
  @ApiBearerAuth("Bearer")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Thêm bình luận mới (Yêu cầu đăng nhập)",
    description:
      "Người dùng gửi bình luận và đánh giá số sao (1-5) cho phòng thuê.",
  })
  @ApiResponse({ status: 201, description: "Thêm bình luận thành công" })
  @ApiResponse({
    status: 400,
    description:
      "Dữ liệu gửi lên không hợp lệ hoặc số sao không nằm trong khoảng 1 đến 5",
  })
  @ApiResponse({
    status: 401,
    description: "Chưa đăng nhập hoặc mã token không hợp lệ",
  })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy phòng thuê hoặc người dùng trên hệ thống",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Put(":id")
  @ApiBearerAuth("Bearer")
  @ApiOperation({ summary: "Chỉnh sửa bình luận (Yêu cầu đăng nhập)" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @ApiResponse({ status: 200, description: "Cập nhật bình luận thành công" })
  @ApiResponse({
    status: 400,
    description: "Dữ liệu cập nhật hoặc ID bình luận không hợp lệ",
  })
  @ApiResponse({
    status: 401,
    description: "Chưa đăng nhập hoặc mã token không hợp lệ",
  })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy bình luận có ID tương ứng để cập nhật",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(":id")
  @ApiBearerAuth("Bearer")
  @ApiOperation({ summary: "Xóa bình luận theo ID (Yêu cầu đăng nhập)" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @ApiResponse({ status: 200, description: "Xóa bình luận thành công" })
  @ApiResponse({ status: 400, description: "ID bình luận không hợp lệ" })
  @ApiResponse({
    status: 401,
    description: "Chưa đăng nhập hoặc mã token không hợp lệ",
  })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy bình luận có ID tương ứng để xóa",
  })
  @ApiResponse({
    status: 500,
    description: "Lỗi máy chủ nội bộ (Internal Server Error)",
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.commentService.remove(id);
  }
}
