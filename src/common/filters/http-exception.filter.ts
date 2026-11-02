import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { statusCodes } from "../constants/status-code.constant";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode: number = statusCodes.INTERNAL_SERVER_ERROR;
    let message = "Internal Server Error";
    let content: any = null;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === "string") {
        message = res;
      } else if (typeof res === "object" && res !== null) {
        const errorObj = res as Record<string, any>;
        if (Array.isArray(errorObj.message)) {
          message = "Dữ liệu đầu vào không hợp lệ!";
          content = errorObj.message;
        } else {
          message = errorObj.message || errorObj.error || message;
          content = errorObj.content !== undefined ? errorObj.content : null;
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `Unhandled Exception: ${exception.message}`,
        exception.stack,
      );
      message = exception.message || "Lỗi hệ thống máy chủ";
    }

    response.status(statusCode).json({
      status: "error",
      statusCode,
      message,
      content,
      dateTime: new Date().toISOString(),
    });
  }
}
