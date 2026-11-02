import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateBinhLuanDto {
  @ApiProperty({ example: 1, description: 'Mã phòng bình luận' })
  @IsNotEmpty({ message: 'Mã phòng không được để trống' })
  @Type(() => Number)
  @IsInt()
  maPhong: number;

  @ApiProperty({ example: 1, description: 'Mã người bình luận' })
  @IsNotEmpty({ message: 'Mã người bình luận không được để trống' })
  @Type(() => Number)
  @IsInt()
  maNguoiBinhLuan: number;

  @ApiPropertyOptional({
    example: '2026-11-02T08:00:00.000Z',
    description: 'Ngày bình luận (nếu không truyền sẽ lấy thời gian hiện tại)',
  })
  @IsOptional()
  @IsString()
  ngayBinhLuan?: string;

  @ApiProperty({ example: 'Phòng sạch sẽ, view rất đẹp và phục vụ chu đáo!', description: 'Nội dung nhận xét' })
  @IsNotEmpty({ message: 'Nội dung bình luận không được để trống' })
  @IsString()
  noiDung: string;

  @ApiProperty({ example: 5, description: 'Số sao đánh giá (từ 1 đến 5)', default: 5 })
  @IsNotEmpty({ message: 'Số sao đánh giá không được để trống' })
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Đánh giá tối thiểu là 1 sao' })
  @Max(5, { message: 'Đánh giá tối đa là 5 sao' })
  saoBinhLuan: number;
}

