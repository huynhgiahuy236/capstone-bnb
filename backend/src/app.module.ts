import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { AppController } from "./app.controller";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { ResponseTransformInterceptor } from "./common/interceptors/response.interceptor";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { PrismaModule } from "./modules-system/prisma/prisma.module";
import { CommonServicesModule } from "./common/services/common-services.module";
import { AuthModule } from "./modules-api/auth/auth.module";
import { UsersModule } from "./modules-api/users/users.module";
import { LocationModule } from "./modules-api/location/location.module";
import { RoomModule } from "./modules-api/room/room.module";
import { BookingModule } from "./modules-api/booking/booking.module";
import { CommentModule } from "./modules-api/comment/comment.module";

@Module({
  imports: [
    PrismaModule,
    CommonServicesModule,
    AuthModule,
    UsersModule,
    LocationModule,
    RoomModule,
    BookingModule,
    CommentModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => {
        const secret =
          process.env.JWT_SECRET ||
          "CYBERSOFT_AIRBNB_DEFAULT_SECRET_KEY_2026_!@#$%^";
        return {
          secret,
          signOptions: {
            expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any,
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
