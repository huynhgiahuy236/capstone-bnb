import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateDatPhongDto {
  @ApiProperty({ example: 1, description: 'Mã phòng muốn đặt' })
  @IsNotEmpty({ message: 'Mã phòng không được để trống' })
  @Type(() => Number)
  @IsInt()
  maPhong: number;

  @ApiProperty({ example: '2026-12-01T14:00:00.000Z', description: 'Ngày đến (Check-in)' })
  @IsNotEmpty({ message: 'Ngày đến không được để trống' })
  @IsDateString({}, { message: 'Ngày đến phải đúng định dạng ngày tháng (ISO 8601)' })
  ngayDen: string;

  @ApiProperty({ example: '2026-12-05T12:00:00.000Z', description: 'Ngày đi (Check-out)' })
  @IsNotEmpty({ message: 'Ngày đi không được để trống' })
  @IsDateString({}, { message: 'Ngày đi phải đúng định dạng ngày tháng (ISO 8601)' })
  ngayDi: string;

  @ApiProperty({ example: 2, description: 'Số lượng khách', default: 1 })
  @IsNotEmpty({ message: 'Số lượng khách không được để trống' })
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Số lượng khách tối thiểu là 1' })
  soLuongKhach: number;

  @ApiProperty({ example: 1, description: 'Mã người đặt phòng' })
  @IsNotEmpty({ message: 'Mã người dùng không được để trống' })
  @Type(() => Number)
  @IsInt()
  maNguoiDung: number;
}

