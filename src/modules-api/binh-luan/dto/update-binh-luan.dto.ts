import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateBinhLuanDto {
  @ApiPropertyOptional({ example: 'Phòng sạch sẽ, view rất đẹp và phục vụ chu đáo!' })
  @IsOptional()
  @IsString()
  noiDung?: string;

  @ApiPropertyOptional({ example: 5, description: 'Số sao đánh giá (1-5)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  saoBinhLuan?: number;
}
