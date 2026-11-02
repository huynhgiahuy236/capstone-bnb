import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateBookingDto {
  @ApiPropertyOptional({ description: 'Mã phòng cần đặt', example: 1 })
  @IsOptional()
  @IsInt()
  maPhong?: number;

  @ApiPropertyOptional({ description: 'Ngày đến (check-in) ISO 8601', example: '2026-12-01T14:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  ngayDen?: string;

  @ApiPropertyOptional({ description: 'Ngày đi (check-out) ISO 8601', example: '2026-12-05T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  ngayDi?: string;

  @ApiPropertyOptional({ description: 'Số lượng khách', example: 2, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  soLuongKhach?: number;

  @ApiPropertyOptional({ description: 'Mã người đặt phòng', example: 1 })
  @IsOptional()
  @IsInt()
  maNguoiDung?: number;
}
