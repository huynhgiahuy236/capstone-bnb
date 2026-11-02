import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNotEmpty, Min } from "class-validator";

export class CreateBookingDto {
  @ApiProperty({ description: "Mã phòng cần đặt", example: 1 })
  @IsNotEmpty({ message: "Mã phòng không được để trống" })
  @IsInt({ message: "Mã phòng phải là số nguyên" })
  maPhong: number;

  @ApiProperty({
    description: "Ngày đến (check-in) ISO 8601",
    example: "2026-12-01T14:00:00.000Z",
  })
  @IsNotEmpty({ message: "Ngày đến không được để trống" })
  @IsDateString({}, { message: "Ngày đến phải theo định dạng ngày ISO 8601" })
  ngayDen: string;

  @ApiProperty({
    description: "Ngày đi (check-out) ISO 8601",
    example: "2026-12-05T12:00:00.000Z",
  })
  @IsNotEmpty({ message: "Ngày đi không được để trống" })
  @IsDateString({}, { message: "Ngày đi phải theo định dạng ngày ISO 8601" })
  ngayDi: string;

  @ApiProperty({ description: "Số lượng khách", example: 2, default: 1 })
  @IsNotEmpty({ message: "Số lượng khách không được để trống" })
  @IsInt({ message: "Số lượng khách phải là số nguyên" })
  @Min(1, { message: "Số lượng khách tối thiểu là 1" })
  soLuongKhach: number;

  @ApiProperty({ description: "Mã người đặt phòng", example: 1 })
  @IsNotEmpty({ message: "Mã người dùng không được để trống" })
  @IsInt({ message: "Mã người dùng phải là số nguyên" })
  maNguoiDung: number;
}
