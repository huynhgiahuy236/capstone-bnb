import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateViTriDto {
  @ApiPropertyOptional({ example: 'Quận 1' })
  @IsOptional()
  @IsString()
  tenViTri?: string;

  @ApiPropertyOptional({ example: 'Hồ Chí Minh' })
  @IsOptional()
  @IsString()
  tinhThanh?: string;

  @ApiPropertyOptional({ example: 'Việt Nam' })
  @IsOptional()
  @IsString()
  quocGia?: string;

  @ApiPropertyOptional({ example: 'https://example.com/hinh-anh.jpg' })
  @IsOptional()
  @IsString()
  hinhAnh?: string;
}

