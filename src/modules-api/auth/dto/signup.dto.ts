import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Họ tên người dùng' })
  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  @IsString({ message: 'Tên người dùng phải là chuỗi ký tự' })
  name: string;

  @ApiProperty({ example: 'user@gmail.com', description: 'Email đăng nhập' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Mật khẩu' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên' })
  password: string;

  @ApiPropertyOptional({ example: '0901234567', description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '2000-01-01', description: 'Ngày sinh' })
  @IsOptional()
  @IsString()
  birthday?: string;

  @ApiPropertyOptional({ example: 'Nam', description: 'Giới tính' })
  @IsOptional()
  gender?: any;

  @ApiPropertyOptional({
    example: 'USER',
    description: 'Vai trò: USER hoặc ADMIN',
    default: 'USER',
  })
  @IsOptional()
  @IsString()
  role?: string;
}

