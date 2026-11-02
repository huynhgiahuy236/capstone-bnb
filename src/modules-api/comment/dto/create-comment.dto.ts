import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'Mã phòng được bình luận', example: 1 })
  @IsNotEmpty({ message: 'Mã phòng không được để trống' })
  @IsInt({ message: 'Mã phòng phải là số nguyên' })
  maPhong: number;

  @ApiProperty({ description: 'Mã người bình luận', example: 1 })
  @IsNotEmpty({ message: 'Mã người bình luận không được để trống' })
  @IsInt({ message: 'Mã người bình luận phải là số nguyên' })
  maNguoiBinhLuan: number;

  @ApiPropertyOptional({
    description: 'Ngày bình luận (ISO 8601), mặc định là thời điểm hiện tại',
    example: '2026-11-02T08:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  ngayBinhLuan?: string;

  @ApiProperty({ description: 'Nội dung bình luận / đánh giá', example: 'Phòng rất sạch đẹp, view ngắm biển tuyệt vời!' })
  @IsNotEmpty({ message: 'Nội dung bình luận không được để trống' })
  @IsString({ message: 'Nội dung phải là chuỗi ký tự' })
  noiDung: string;

  @ApiProperty({ description: 'Số sao đánh giá (từ 1 đến 5 sao)', example: 5, default: 5 })
  @IsNotEmpty({ message: 'Số sao đánh giá không được để trống' })
  @IsInt({ message: 'Số sao phải là số nguyên' })
  @Min(1, { message: 'Đánh giá tối thiểu là 1 sao' })
  @Max(5, { message: 'Đánh giá tối đa là 5 sao' })
  saoBinhLuan: number;
}
