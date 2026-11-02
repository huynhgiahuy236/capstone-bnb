import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'Tên phòng thuê', example: 'Căn hộ Studio Landmark 81' })
  @IsNotEmpty({ message: 'Tên phòng không được để trống' })
  @IsString({ message: 'Tên phòng phải là chuỗi ký tự' })
  tenPhong: string;

  @ApiPropertyOptional({ description: 'Số lượng khách tối đa', default: 1, example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  khach?: number = 1;

  @ApiPropertyOptional({ description: 'Số lượng phòng ngủ', default: 1, example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  phongNgu?: number = 1;

  @ApiPropertyOptional({ description: 'Số lượng giường', default: 1, example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  giuong?: number = 1;

  @ApiPropertyOptional({ description: 'Số lượng phòng tắm', default: 1, example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  phongTam?: number = 1;

  @ApiPropertyOptional({ description: 'Mô tả chi tiết phòng', example: 'Căn hộ view thành phố cực đẹp' })
  @IsOptional()
  @IsString()
  moTa?: string;

  @ApiProperty({ description: 'Giá tiền mỗi đêm (VNĐ)', example: 1200000 })
  @IsNotEmpty({ message: 'Giá tiền không được để trống' })
  @IsInt({ message: 'Giá tiền phải là số nguyên' })
  @Min(0)
  giaTien: number;

  @ApiPropertyOptional({ description: 'Có máy giặt không', default: false })
  @IsOptional()
  @IsBoolean()
  mayGiat?: boolean = false;

  @ApiPropertyOptional({ description: 'Có bàn là không', default: false })
  @IsOptional()
  @IsBoolean()
  banLa?: boolean = false;

  @ApiPropertyOptional({ description: 'Có TV không', default: false })
  @IsOptional()
  @IsBoolean()
  tivi?: boolean = false;

  @ApiPropertyOptional({ description: 'Có điều hòa không', default: false })
  @IsOptional()
  @IsBoolean()
  dieuHoa?: boolean = false;

  @ApiPropertyOptional({ description: 'Có Wifi không', default: false })
  @IsOptional()
  @IsBoolean()
  wifi?: boolean = false;

  @ApiPropertyOptional({ description: 'Có bếp không', default: false })
  @IsOptional()
  @IsBoolean()
  bep?: boolean = false;

  @ApiPropertyOptional({ description: 'Có chỗ đỗ xe không', default: false })
  @IsOptional()
  @IsBoolean()
  doXe?: boolean = false;

  @ApiPropertyOptional({ description: 'Có hồ bơi không', default: false })
  @IsOptional()
  @IsBoolean()
  hoBoi?: boolean = false;

  @ApiPropertyOptional({ description: 'Có bàn ủi không', default: false })
  @IsOptional()
  @IsBoolean()
  banUi?: boolean = false;

  @ApiPropertyOptional({ description: 'Mã vị trí của phòng', example: 1 })
  @IsOptional()
  @IsInt()
  maViTri?: number;

  @ApiPropertyOptional({ description: 'URL hình ảnh phòng', example: 'https://images.unsplash.com/room.jpg' })
  @IsOptional()
  @IsString()
  hinhAnh?: string;
}
