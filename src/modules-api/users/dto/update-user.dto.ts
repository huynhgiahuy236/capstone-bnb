import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "Nguyễn Văn A" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: "user@gmail.com" })
  @IsOptional()
  @IsEmail({}, { message: "Email không đúng định dạng" })
  email?: string;

  @ApiPropertyOptional({ example: "0901234567" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: "2000-01-01" })
  @IsOptional()
  @IsString()
  birthday?: string;

  @ApiPropertyOptional({ example: "Nam" })
  @IsOptional()
  gender?: any;

  @ApiPropertyOptional({ example: "USER" })
  @IsOptional()
  @IsString()
  role?: string;
}
