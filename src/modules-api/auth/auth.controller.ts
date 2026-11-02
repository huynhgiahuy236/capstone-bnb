import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Đăng ký tài khoản người dùng mới',
    description: 'Tạo tài khoản mới với vai trò USER (hoặc ADMIN). Mật khẩu được băm bảo mật bằng bcrypt.',
  })
  @ApiResponse({ status: 201, description: 'Đăng ký tài khoản thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu gửi lên không hợp lệ (thiếu trường, sai định dạng email)' })
  @ApiResponse({ status: 409, description: 'Email này đã được đăng ký trong hệ thống, vui lòng chọn email khác' })
  @ApiResponse({ status: 500, description: 'Lỗi máy chủ nội bộ (Internal Server Error)' })
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập hệ thống',
    description: 'Đăng nhập bằng Email và Password, trả về thông tin người dùng và mã JWT Access Token.',
  })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công, trả về Access Token' })
  @ApiResponse({ status: 400, description: 'Dữ liệu gửi lên không hợp lệ hoặc tài khoản đăng nhập bằng Google' })
  @ApiResponse({ status: 401, description: 'Mật khẩu không chính xác' })
  @ApiResponse({ status: 404, description: 'Tài khoản email chưa được đăng ký trong hệ thống' })
  @ApiResponse({ status: 500, description: 'Lỗi máy chủ nội bộ (Internal Server Error)' })
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }
}
