import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePhongDto {
  @ApiProperty({ example: 'Phòng VIP View Biển', description: 'Tên phòng thuê' })
  @IsNotEmpty({ message: 'Tên phòng không được để trống' })
  @IsString()
  tenPhong: string;

  @ApiPropertyOptional({ example: 4, description: 'Số lượng khách tối đa', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  khach?: number = 1;

  @ApiPropertyOptional({ example: 2, description: 'Số phòng ngủ', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  phongNgu?: number = 1;

  @ApiPropertyOptional({ example: 2, description: 'Số giường', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  giuong?: number = 1;

  @ApiPropertyOptional({ example: 1, description: 'Số phòng tắm', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  phongTam?: number = 1;

  @ApiPropertyOptional({ example: 'Phòng đầy đủ tiện nghi view đẹp trung tâm', description: 'Mô tả phòng' })
  @IsOptional()
  @IsString()
  moTa?: string;

  @ApiPropertyOptional({ example: 850000, description: 'Giá tiền theo đêm (VNĐ)', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  giaTien?: number = 0;

  @ApiPropertyOptional({ example: true, description: 'Có máy giặt không', default: false })
  @IsOptional()
  @IsBoolean()
  mayGiat?: boolean = false;

  @ApiPropertyOptional({ example: true, description: 'Có bàn là không', default: false })
  @IsOptional()
  @IsBoolean()
  banLa?: boolean = false;

  @ApiPropertyOptional({ example: true, description: 'Có TV không', default: false })
  @IsOptional()
  @IsBoolean()
  tivi?: boolean = false;

  @ApiPropertyOptional({ example: true, description: 'Có điều hòa không', default: false })
  @IsOptional()
  @IsBoolean()
  dieuHoa?: boolean = false;

  @ApiPropertyOptional({ example: true, description: 'Có Wifi không', default: false })
  @IsOptional()
  @IsBoolean()
  wifi?: boolean = false;

  @ApiPropertyOptional({ example: true, description: 'Có bếp không', default: false })
  @IsOptional()
  @IsBoolean()
  bep?: boolean = false;

  @ApiPropertyOptional({ example: true, description: 'Có chỗ đỗ xe không', default: false })
  @IsOptional()
  @IsBoolean()
  doXe?: boolean = false;

  @ApiPropertyOptional({ example: true, description: 'Có hồ bơi không', default: false })
  @IsOptional()
  @IsBoolean()
  hoBoi?: boolean = false;

  @ApiPropertyOptional({ example: true, description: 'Có bàn ủi không', default: false })
  @IsOptional()
  @IsBoolean()
  banUi?: boolean = false;

  @ApiPropertyOptional({ example: 1, description: 'Mã vị trí (tham chiếu bảng ViTri)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maViTri?: number;

  @ApiPropertyOptional({ example: 'https://example.com/phong.jpg', description: 'Hình ảnh phòng' })
  @IsOptional()
  @IsString()
  hinhAnh?: string;
}
