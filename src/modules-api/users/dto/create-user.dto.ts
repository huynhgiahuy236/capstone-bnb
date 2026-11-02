import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Trần Thị B', description: 'Họ tên người dùng' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'user2@gmail.com', description: 'Email' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Mật khẩu' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' })
  password: string;

  @ApiPropertyOptional({ example: '0912345678', description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '1998-05-20', description: 'Ngày sinh' })
  @IsOptional()
  @IsString()
  birthday?: string;

  @ApiPropertyOptional({ example: 'Nữ', description: 'Giới tính' })
  @IsOptional()
  gender?: any;

  @ApiPropertyOptional({ example: 'USER', description: 'Vai trò: USER hoặc ADMIN' })
  @IsOptional()
  @IsString()
  role?: string;
}

