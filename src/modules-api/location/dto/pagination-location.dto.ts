import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationLocationDto {
  @ApiPropertyOptional({ description: 'Chỉ số trang (bắt đầu từ 1)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'pageIndex phải là số nguyên' })
  @Min(1, { message: 'pageIndex tối thiểu là 1' })
  pageIndex?: number = 1;

  @ApiPropertyOptional({ description: 'Số lượng mục trên mỗi trang', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'pageSize phải là số nguyên' })
  @Min(1, { message: 'pageSize tối thiểu là 1' })
  pageSize?: number = 10;

  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm theo tên vị trí hoặc tỉnh thành' })
  @IsOptional()
  @IsString()
  keyword?: string;
}
