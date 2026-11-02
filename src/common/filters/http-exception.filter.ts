import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { statusCodes } from '../constants/status-code.constant';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode: number = statusCodes.INTERNAL_SERVER_ERROR;
    let message = 'Lỗi máy chủ nội bộ (Internal Server Error)';
    let content: any = null;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const errorObj = res as Record<string, any>;
        message = errorObj.error || errorObj.message || message;
        // Nếu là lỗi validation từ ValidationPipe (mảng message)
        if (Array.isArray(errorObj.message)) {
          content = errorObj.message;
          message = 'Dữ liệu đầu vào không hợp lệ';
        } else if (errorObj.message) {
          message = errorObj.message;
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled Exception: ${exception.message}`, exception.stack);
      message = exception.message;
    }

    response.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      content,
      dateTime: new Date().toISOString(),
    });
  }
}
