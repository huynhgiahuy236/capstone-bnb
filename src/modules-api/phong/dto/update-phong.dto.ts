import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdatePhongDto {
  @ApiPropertyOptional({ example: 'Phòng VIP View Biển' })
  @IsOptional()
  @IsString()
  tenPhong?: string;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  khach?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  phongNgu?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  giuong?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  phongTam?: number;

  @ApiPropertyOptional({ example: 'Mô tả phòng chi tiết' })
  @IsOptional()
  @IsString()
  moTa?: string;

  @ApiPropertyOptional({ example: 850000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  giaTien?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  mayGiat?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  banLa?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  tivi?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  dieuHoa?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  wifi?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  bep?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  doXe?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  hoBoi?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  banUi?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maViTri?: number;

  @ApiPropertyOptional({ example: 'https://example.com/phong.jpg' })
  @IsOptional()
  @IsString()
  hinhAnh?: string;
}
