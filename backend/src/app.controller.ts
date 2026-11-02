import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "./common/decorators/public.decorator";

@ApiTags("HealthCheck")
@Controller()
export class AppController {
  @Public()
  @Get()
  @ApiOperation({ summary: "Kiểm tra trạng thái server" })
  getHello(): { message: string; version: string } {
    return {
      message: "Capstone Airbnb API Server is running successfully!",
      version: "1.0.0",
    };
  }
}
