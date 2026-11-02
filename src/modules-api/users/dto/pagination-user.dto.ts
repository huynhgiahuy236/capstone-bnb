import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationUserDto {
  @ApiPropertyOptional({ example: 1, description: 'Số trang (mặc định 1)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageIndex?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Số phần tử trên 1 trang (mặc định 10)', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @ApiPropertyOptional({ example: '', description: 'Từ khóa tìm kiếm theo tên' })
  @IsOptional()
  @IsString()
  keyword?: string;
}

