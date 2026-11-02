import { describe, expect, it } from "vitest";

import {
  adminUserSchema,
  bookingSchema,
  commentSchema,
  locationSchema,
  profileSchema,
  roomSchema,
  signInSchema,
  signUpSchema,
} from "@/app/lib/schemas";

describe("Zod Validation Schemas (validation-schemas)", () => {
  it("TC30: signInSchema accepts valid email and min-6-char password", () => {
    const valid = signInSchema.safeParse({
      email: "huy@example.com",
      password: "Password123!",
    });
    expect(valid.success).toBe(true);
  });

  it("TC31: signInSchema rejects malformed email", () => {
    const invalid = signInSchema.safeParse({
      email: "not-an-email",
      password: "Password123!",
    });
    expect(invalid.success).toBe(false);
  });

  it("TC32: signInSchema rejects password shorter than 6 characters", () => {
    const invalid = signInSchema.safeParse({
      email: "huy@example.com",
      password: "12345",
    });
    expect(invalid.success).toBe(false);
  });

  it("TC33: signUpSchema accepts complete valid signup payload", () => {
    const valid = signUpSchema.safeParse({
      birthday: "1998-05-15",
      email: "test@domain.com",
      gender: "true",
      name: "Nguyễn Văn Test",
      password: "Password123@",
      phone: "0901234567",
    });
    expect(valid.success).toBe(true);
  });

  it("TC34: signUpSchema rejects empty name", () => {
    const invalid = signUpSchema.safeParse({
      birthday: "1998-05-15",
      email: "test@domain.com",
      gender: "true",
      name: "   ",
      password: "Password123@",
      phone: "0901234567",
    });
    expect(invalid.success).toBe(false);
  });

  it("TC35: signUpSchema rejects phone number that does not match 10-digit Vietnamese telecom prefix", () => {
    const invalid = signUpSchema.safeParse({
      birthday: "1998-05-15",
      email: "test@domain.com",
      gender: "true",
      name: "Tester",
      password: "Password123@",
      phone: "0123456789", // 01 is not a valid 10-digit VN mobile prefix
    });
    expect(invalid.success).toBe(false);
  });

  it("TC36: signUpSchema rejects password missing special characters", () => {
    const invalid = signUpSchema.safeParse({
      birthday: "1998-05-15",
      email: "test@domain.com",
      gender: "true",
      name: "Tester",
      password: "Password1234", // Missing special character
      phone: "0901234567",
    });
    expect(invalid.success).toBe(false);
  });

  it("TC37: signUpSchema rejects future birthday", () => {
    const invalid = signUpSchema.safeParse({
      birthday: "2099-01-01",
      email: "test@domain.com",
      gender: "true",
      name: "Tester",
      password: "Password123@",
      phone: "0901234567",
    });
    expect(invalid.success).toBe(false);
  });

  it("TC38: signUpSchema rejects malformed birthday string format", () => {
    const invalid = signUpSchema.safeParse({
      birthday: "15-05-1998",
      email: "test@domain.com",
      gender: "true",
      name: "Tester",
      password: "Password123@",
      phone: "0901234567",
    });
    expect(invalid.success).toBe(false);
  });

  it("TC39: profileSchema accepts valid profile updates without requiring password", () => {
    const valid = profileSchema.safeParse({
      birthday: "2000-01-01",
      email: "profile@example.com",
      gender: "false",
      name: "Trần Thị B",
      phone: "0912345678",
      role: "USER",
    });
    expect(valid.success).toBe(true);
  });

  it("TC40: profileSchema rejects invalid user role", () => {
    const invalid = profileSchema.safeParse({
      birthday: "2000-01-01",
      email: "profile@example.com",
      gender: "false",
      name: "Trần Thị B",
      phone: "0912345678",
      role: "SUPERADMIN",
    });
    expect(invalid.success).toBe(false);
  });

  it("TC41: adminUserSchema permits empty password string for updating existing user", () => {
    const valid = adminUserSchema.safeParse({
      birthday: "1995-10-10",
      email: "user@admin.com",
      gender: "true",
      name: "Admin Managed",
      password: "",
      phone: "0987654321",
      role: "ADMIN",
    });
    expect(valid.success).toBe(true);
  });

  it("TC42: adminUserSchema strictly checks password complexity if a non-empty password is entered", () => {
    const invalid = adminUserSchema.safeParse({
      birthday: "1995-10-10",
      email: "user@admin.com",
      gender: "true",
      name: "Admin Managed",
      password: "simplepassword",
      phone: "0987654321",
      role: "ADMIN",
    });
    expect(invalid.success).toBe(false);
  });

  it("TC43: locationSchema accepts valid location payload", () => {
    const valid = locationSchema.safeParse({
      hinhAnh: "https://example.com/hanoi.jpg",
      quocGia: "Việt Nam",
      tenViTri: "Hồ Hoàn Kiếm",
      tinhThanh: "Hà Nội",
    });
    expect(valid.success).toBe(true);
  });

  it("TC44: locationSchema rejects empty tenViTri", () => {
    const invalid = locationSchema.safeParse({
      quocGia: "Việt Nam",
      tenViTri: "   ",
      tinhThanh: "Đà Nẵng",
    });
    expect(invalid.success).toBe(false);
  });

  it("TC45: roomSchema accepts valid room payload with all 10 standard boolean amenities", () => {
    const valid = roomSchema.safeParse({
      banLa: true,
      banUi: true,
      bep: true,
      dieuHoa: true,
      doXe: false,
      giaTien: 1200000,
      giuong: 2,
      hinhAnh: "https://example.com/room.jpg",
      hoBoi: false,
      khach: 4,
      maViTri: 1,
      mayGiat: true,
      moTa: "Căn hộ sang trọng trung tâm thành phố",
      phongNgu: 2,
      phongTam: 2,
      tenPhong: "Modern Studio",
      tivi: true,
      wifi: true,
    });
    expect(valid.success).toBe(true);
  });

  it("TC46: roomSchema rejects room with non-positive price or zero guests", () => {
    const invalid = roomSchema.safeParse({
      banLa: false,
      banUi: false,
      bep: false,
      dieuHoa: false,
      doXe: false,
      giaTien: 0,
      giuong: 1,
      hoBoi: false,
      khach: 0,
      maViTri: 1,
      mayGiat: false,
      moTa: "Mô tả",
      phongNgu: 1,
      phongTam: 1,
      tenPhong: "Test Room",
      tivi: false,
      wifi: false,
    });
    expect(invalid.success).toBe(false);
  });

  it("TC47: bookingSchema accepts valid booking form data", () => {
    const valid = bookingSchema.safeParse({
      ngayDen: "2026-12-01",
      ngayDi: "2026-12-05",
      soLuongKhach: 2,
    });
    expect(valid.success).toBe(true);
  });

  it("TC48: bookingSchema rejects non-positive guest count", () => {
    const invalid = bookingSchema.safeParse({
      ngayDen: "2026-12-01",
      ngayDi: "2026-12-05",
      soLuongKhach: 0,
    });
    expect(invalid.success).toBe(false);
  });

  it("TC49: commentSchema verifies star rating must be between 1 and 5 and content min 3 characters", () => {
    const valid = commentSchema.safeParse({
      noiDung: "Trải nghiệm tuyệt vời!",
      saoBinhLuan: 5,
    });
    expect(valid.success).toBe(true);

    const invalidZero = commentSchema.safeParse({
      noiDung: "Quá tệ!",
      saoBinhLuan: 0,
    });
    expect(invalidZero.success).toBe(false);

    const invalidSix = commentSchema.safeParse({
      noiDung: "Quá mức!",
      saoBinhLuan: 6,
    });
    expect(invalidSix.success).toBe(false);
  });
});
