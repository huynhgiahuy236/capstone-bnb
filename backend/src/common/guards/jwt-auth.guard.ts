import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        "Yêu cầu token xác thực (Vui lòng đăng nhập)",
      );
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new UnauthorizedException(
          "Lỗi cấu hình server: Chưa thiết lập JWT_SECRET!",
        );
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret,
      });
      request["user"] = payload;
    } catch {
      throw new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn!");
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    // Hỗ trợ cả Authorization: Bearer <token> lẫn header "token" theo chuẩn CyberSoft
    const authHeader = request.headers["authorization"];
    if (authHeader) {
      const [type, token] = authHeader.split(" ");
      if (type?.toLowerCase() === "bearer" && token) {
        return token;
      }
      return authHeader;
    }

    if (request.headers["token"]) {
      return request.headers["token"];
    }

    return undefined;
  }
}
