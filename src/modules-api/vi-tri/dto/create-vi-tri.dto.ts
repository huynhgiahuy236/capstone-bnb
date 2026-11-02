import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateViTriDto {
  @ApiProperty({ example: 'Quận 1', description: 'Tên vị trí / khu vực' })
  @IsNotEmpty({ message: 'Tên vị trí không được để trống' })
  @IsString()
  tenViTri: string;

  @ApiProperty({ example: 'Hồ Chí Minh', description: 'Tỉnh / thành phố' })
  @IsNotEmpty({ message: 'Tỉnh thành không được để trống' })
  @IsString()
  tinhThanh: string;

  @ApiPropertyOptional({ example: 'Việt Nam', description: 'Quốc gia', default: 'Việt Nam' })
  @IsOptional()
  @IsString()
  quocGia?: string = 'Việt Nam';

  @ApiPropertyOptional({ example: 'https://example.com/hinh-anh.jpg', description: 'Hình ảnh' })
  @IsOptional()
  @IsString()
  hinhAnh?: string;
}
