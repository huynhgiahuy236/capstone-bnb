import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({
    description: 'Tên địa điểm / vị trí',
    example: 'Quận 1, Hồ Chí Minh',
  })
  @IsNotEmpty({ message: 'Tên vị trí không được để trống' })
  @IsString({ message: 'Tên vị trí phải là chuỗi ký tự' })
  tenViTri: string;

  @ApiProperty({
    description: 'Tỉnh thành',
    example: 'Hồ Chí Minh',
  })
  @IsNotEmpty({ message: 'Tỉnh thành không được để trống' })
  @IsString({ message: 'Tỉnh thành phải là chuỗi ký tự' })
  tinhThanh: string;

  @ApiProperty({
    description: 'Quốc gia',
    example: 'Việt Nam',
    required: false,
    default: 'Việt Nam',
  })
  @IsOptional()
  @IsString()
  quocGia?: string;

  @ApiProperty({
    description: 'Đường dẫn URL hình ảnh vị trí',
    example: 'https://images.unsplash.com/photo-location.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  hinhAnh?: string;
}
