import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { statusCodes } from "../constants/status-code.constant";

export interface StandardResponse<T> {
  status: "success" | "error";
  statusCode: number;
  message: string;
  content: T;
  dateTime: string;
}

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<
  T,
  StandardResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode || statusCodes.OK;

    return next.handle().pipe(
      map((result) => {
        let message = "Xử lý thành công";
        let content: any = result;

        // Nếu service trả về object có custom message hoặc content riêng biệt
        if (
          result &&
          typeof result === "object" &&
          !Array.isArray(result) &&
          ("message" in result || "content" in result)
        ) {
          if (result.message) {
            message = result.message;
          }
          if ("content" in result) {
            content = result.content;
          }
        }

        return {
          status: "success",
          statusCode,
          message,
          content: content ?? null,
          dateTime: new Date().toISOString(),
        };
      }),
    );
  }
}
