import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { describe, expect, it } from "vitest";

import { getApiErrorMessage, isApiNotFoundError } from "@/app/lib/api/client";

const createAxiosError = ({
  code,
  data,
  message = "Request failed",
  status,
}: {
  code?: string;
  data?: unknown;
  message?: string;
  status?: number;
}): AxiosError => {
  const error = new AxiosError(message);
  error.code = code;
  if (status !== undefined) {
    error.response = {
      config: {} as InternalAxiosRequestConfig,
      data,
      headers: {},
      status,
      statusText: String(status),
    } as AxiosResponse;
  }
  return error;
};

describe("API Error Normalization & Helper (api-error)", () => {
  it("TC01: returns fallback message for standard Error instance containing AxiosError in message", () => {
    const error = new Error("Generic AxiosError occurred");
    expect(getApiErrorMessage(error, "Lỗi mặc định")).toBe("Lỗi mặc định");
  });

  it("TC02: returns custom error message for standard Error instance", () => {
    const error = new Error("Tài khoản chưa được kích hoạt");
    expect(getApiErrorMessage(error)).toBe("Tài khoản chưa được kích hoạt");
  });

  it("TC03: returns network connection failure message when response is missing", () => {
    const error = createAxiosError({ message: "Network Error" });
    expect(getApiErrorMessage(error)).toBe(
      "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.",
    );
  });

  it("TC04: returns timeout message when code is ECONNABORTED", () => {
    const error = createAxiosError({ code: "ECONNABORTED" });
    expect(getApiErrorMessage(error)).toBe(
      "Kết nối đến máy chủ bị quá thời gian. Vui lòng thử lại.",
    );
  });

  it("TC05: extracts message string directly from data string and removes trailing exclamation", () => {
    const error = createAxiosError({
      data: "Dữ liệu không hợp lệ!",
      status: 400,
    });
    expect(getApiErrorMessage(error)).toBe("Dữ liệu không hợp lệ.");
  });

  it("TC06: extracts message from data.content or data.message object", () => {
    const error = createAxiosError({
      data: { message: "Mã phòng không tồn tại" },
      status: 404,
    });
    expect(getApiErrorMessage(error)).toBe("Mã phòng không tồn tại");
  });

  it("TC07: ignores HTML error bodies such as 502 Bad Gateway and falls back to status mapping", () => {
    const error = createAxiosError({
      data: "<html><body>502 Bad Gateway</body></html>",
      status: 502,
    });
    expect(getApiErrorMessage(error)).toBe(
      "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.",
    );
  });

  it("TC08: maps duplicate email message in Vietnamese to friendly advice", () => {
    const error = createAxiosError({
      data: { message: "Email đã tồn tại trong hệ thống" },
      status: 400,
    });
    expect(getApiErrorMessage(error)).toBe(
      "Email này đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập.",
    );
  });

  it("TC09: maps duplicate email message in English to friendly advice", () => {
    const error = createAxiosError({
      data: { message: "email already exists" },
      status: 409,
    });
    expect(getApiErrorMessage(error)).toBe(
      "Email này đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập.",
    );
  });

  it("TC10: maps 401 Unauthorized status when no body message provided", () => {
    const error = createAxiosError({ status: 401 });
    expect(getApiErrorMessage(error)).toBe(
      "Phiên đăng nhập đã hết hạn hoặc không có quyền truy cập.",
    );
  });

  it("TC11: maps 403 Forbidden status when no body message provided", () => {
    const error = createAxiosError({ status: 403 });
    expect(getApiErrorMessage(error)).toBe(
      "Bạn không có quyền thực hiện thao tác này.",
    );
  });

  it("TC12: verifies isApiNotFoundError correctly identifies 404 and 400 statuses", () => {
    const error404 = createAxiosError({ status: 404 });
    const error400 = createAxiosError({ status: 400 });
    const error500 = createAxiosError({ status: 500 });
    const nonAxios = new Error("Not an axios error");

    expect(isApiNotFoundError(error404)).toBe(true);
    expect(isApiNotFoundError(error400)).toBe(true);
    expect(isApiNotFoundError(error500)).toBe(false);
    expect(isApiNotFoundError(nonAxios)).toBe(false);
  });
});
