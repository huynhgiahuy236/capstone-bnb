import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateCommentDto {
  @ApiPropertyOptional({
    description: "Nội dung bình luận mới",
    example: "Đã cập nhật: rất ưng ý dịch vụ!",
  })
  @IsOptional()
  @IsString()
  noiDung?: string;

  @ApiPropertyOptional({
    description: "Số sao đánh giá mới (1 - 5 sao)",
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  saoBinhLuan?: number;
}
