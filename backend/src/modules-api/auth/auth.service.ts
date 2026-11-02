import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../../modules-system/prisma/prisma.service";
import { SignupDto } from "./dto/signup.dto";
import { SigninDto } from "./dto/signin.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Đăng ký tài khoản người dùng mới
   */
  async signup(signupDto: SignupDto) {
    const { email, password, name, phone, birthday, gender, role } = signupDto;

    // 1. Kiểm tra email đã tồn tại hay chưa
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        "Email này đã được đăng ký trong hệ thống, vui lòng chọn email khác!",
      );
    }

    // 2. Hash mật khẩu bằng bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Chuẩn hóa giới tính
    let formattedGender = "Nam";
    if (gender !== undefined && gender !== null) {
      if (
        gender === false ||
        gender === "false" ||
        gender === "Nữ" ||
        gender === "Nu"
      ) {
        formattedGender = "Nữ";
      }
    }

    // 4. Tạo người dùng trong database
    const newUser = await this.prisma.nguoiDung.create({
      data: {
        name,
        email,
        pass_word: hashedPassword,
        phone: phone || null,
        birth_day: birthday || null,
        gender: formattedGender,
        role: role?.toUpperCase() === "ADMIN" ? "ADMIN" : "USER",
      },
    });

    // 5. Loại bỏ mật khẩu khi trả kết quả
    const { pass_word: _pass_word, ...userWithoutPassword } = newUser;
    return {
      message: "Đăng ký tài khoản thành công!",
      content: userWithoutPassword,
    };
  }

  /**
   * Đăng nhập hệ thống & cấp JWT Token
   */
  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;

    // 1. Tìm người dùng theo email (chưa bị xóa mềm)
    const user = await this.prisma.nguoiDung.findFirst({
      where: {
        email,
        isDeleted: false,
      },
    });

    if (!user) {
      throw new NotFoundException(
        "Tài khoản email này chưa được đăng ký trong hệ thống!",
      );
    }

    if (!user.pass_word) {
      throw new BadRequestException(
        "Tài khoản này được đăng ký thông qua mạng xã hội, vui lòng đăng nhập bằng Google!",
      );
    }

    // 2. So sánh mật khẩu băm
    const isPasswordValid = await bcrypt.compare(password, user.pass_word);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        "Mật khẩu không chính xác, vui lòng thử lại!",
      );
    }

    // 3. Ký Access Token
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    // 4. Trả về token và thông tin người dùng
    const { pass_word: _pass_word, ...userWithoutPassword } = user;
    return {
      message: "Đăng nhập thành công!",
      content: {
        user: userWithoutPassword,
        token,
      },
    };
  }
}
