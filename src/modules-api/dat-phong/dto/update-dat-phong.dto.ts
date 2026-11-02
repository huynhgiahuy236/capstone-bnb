import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateDatPhongDto {
  @ApiPropertyOptional({ example: 1, description: 'Mã phòng' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maPhong?: number;

  @ApiPropertyOptional({ example: '2026-12-01T14:00:00.000Z', description: 'Ngày đến' })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày đến phải đúng định dạng ngày tháng' })
  ngayDen?: string;

  @ApiPropertyOptional({ example: '2026-12-05T12:00:00.000Z', description: 'Ngày đi' })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày đi phải đúng định dạng ngày tháng' })
  ngayDi?: string;

  @ApiPropertyOptional({ example: 2, description: 'Số lượng khách' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  soLuongKhach?: number;

  @ApiPropertyOptional({ example: 1, description: 'Mã người đặt phòng' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maNguoiDung?: number;
}
