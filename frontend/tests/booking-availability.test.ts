import { describe, expect, it } from "vitest";

import type { ApiBooking } from "@/app/lib/api/bookings";
import type { ApiRoom } from "@/app/lib/api/rooms";
import {
  filterAvailableRooms,
  getStayDateRange,
  hasBookingConflict,
  isValidDateKey,
  normalizeDateKey,
  validateBookingBusinessRules,
} from "@/app/lib/booking-availability";

const mockBookings: ApiBooking[] = [
  {
    id: 101,
    maNguoiDung: 1,
    maPhong: 1,
    ngayDen: "2026-12-10T00:00:00.000Z",
    ngayDi: "2026-12-15T00:00:00.000Z",
    soLuongKhach: 2,
  },
  {
    id: 102,
    maNguoiDung: 2,
    maPhong: 1,
    ngayDen: "2026-12-20T00:00:00.000Z",
    ngayDi: "2026-12-25T00:00:00.000Z",
    soLuongKhach: 3,
  },
  {
    id: 103,
    maNguoiDung: 3,
    maPhong: 2,
    ngayDen: "2026-12-10T00:00:00.000Z",
    ngayDi: "2026-12-15T00:00:00.000Z",
    soLuongKhach: 4,
  },
];

const mockRoom1: ApiRoom = {
  banLa: true,
  banUi: true,
  bep: true,
  dieuHoa: true,
  doXe: true,
  giaTien: 1000000,
  giuong: 2,
  hinhAnh: "https://example.com/room1.jpg",
  hoBoi: false,
  id: 1,
  khach: 4,
  maViTri: 1,
  mayGiat: true,
  moTa: "Phòng nghỉ dưỡng cao cấp view biển",
  phongNgu: 1,
  phongTam: 1,
  tenPhong: "Luxury Ocean Suite",
  tivi: true,
  wifi: true,
};

describe("Booking Availability & Overlap Prevention (booking-availability)", () => {
  it("TC13: normalizeDateKey slices standard YYYY-MM-DD from full ISO string", () => {
    expect(normalizeDateKey("2026-11-02T08:30:00.000Z")).toBe("2026-11-02");
  });

  it("TC14: normalizeDateKey returns empty string for falsy input", () => {
    expect(normalizeDateKey("")).toBe("");
  });

  it("TC15: isValidDateKey returns true for valid calendar date", () => {
    expect(isValidDateKey("2026-12-31")).toBe(true);
  });

  it("TC16: isValidDateKey returns false for invalid formatted string", () => {
    expect(isValidDateKey("31-12-2026")).toBe(false);
    expect(isValidDateKey("2026/12/31")).toBe(false);
    expect(isValidDateKey("random-string")).toBe(false);
  });

  it("TC17: isValidDateKey returns false for non-existent calendar date", () => {
    expect(isValidDateKey("2026-02-30")).toBe(false);
    expect(isValidDateKey("2026-04-31")).toBe(false);
  });

  it("TC18: getStayDateRange returns normalized range object when checkIn < checkOut", () => {
    const range = getStayDateRange("2026-12-01", "2026-12-05");
    expect(range).toEqual({
      checkIn: "2026-12-01",
      checkOut: "2026-12-05",
    });
  });

  it("TC19: getStayDateRange returns null when checkIn >= checkOut", () => {
    expect(getStayDateRange("2026-12-05", "2026-12-01")).toBeNull();
    expect(getStayDateRange("2026-12-05", "2026-12-05")).toBeNull();
  });

  it("TC20: getStayDateRange returns null when any date is invalid", () => {
    expect(getStayDateRange("invalid", "2026-12-05")).toBeNull();
  });

  it("TC21: hasBookingConflict detects exact overlap with existing booking", () => {
    const conflict = hasBookingConflict(mockBookings, 1, {
      checkIn: "2026-12-10",
      checkOut: "2026-12-15",
    });
    expect(conflict).toBe(true);
  });

  it("TC22: hasBookingConflict detects requested range overlapping front edge of existing booking", () => {
    const conflict = hasBookingConflict(mockBookings, 1, {
      checkIn: "2026-12-08",
      checkOut: "2026-12-12",
    });
    expect(conflict).toBe(true);
  });

  it("TC23: hasBookingConflict detects requested range overlapping back edge of existing booking", () => {
    const conflict = hasBookingConflict(mockBookings, 1, {
      checkIn: "2026-12-14",
      checkOut: "2026-12-18",
    });
    expect(conflict).toBe(true);
  });

  it("TC24: hasBookingConflict detects existing booking completely enveloped inside requested range", () => {
    const conflict = hasBookingConflict(mockBookings, 1, {
      checkIn: "2026-12-08",
      checkOut: "2026-12-18",
    });
    expect(conflict).toBe(true);
  });

  it("TC25: hasBookingConflict allows same-day checkout/checkin transition (zero night overlap)", () => {
    // Booking 1 is Dec 10 to Dec 15. A new guest checking in on Dec 15 does not conflict.
    const conflict = hasBookingConflict(mockBookings, 1, {
      checkIn: "2026-12-15",
      checkOut: "2026-12-20",
    });
    expect(conflict).toBe(false);
  });

  it("TC26: hasBookingConflict ignores specified excludeBookingId when updating existing reservation", () => {
    const conflict = hasBookingConflict(
      mockBookings,
      1,
      { checkIn: "2026-12-10", checkOut: "2026-12-15" },
      101, // exclude booking 101 itself
    );
    expect(conflict).toBe(false);
  });

  it("TC27: filterAvailableRooms correctly removes conflicting rooms from available room list", () => {
    const available = filterAvailableRooms(
      [mockRoom1, { ...mockRoom1, id: 2 }, { ...mockRoom1, id: 3 }],
      mockBookings,
      { checkIn: "2026-12-11", checkOut: "2026-12-14" },
    );
    // Rooms 1 and 2 are booked from Dec 10 to Dec 15. Only Room 3 is available.
    expect(available.map((r) => r.id)).toEqual([3]);
  });

  it("TC28: validateBookingBusinessRules flags ROOM_CAPACITY_EXCEEDED when guests exceed room capacity", () => {
    const result = validateBookingBusinessRules(
      mockRoom1,
      {
        maNguoiDung: 1,
        maPhong: 1,
        ngayDen: "2026-12-01",
        ngayDi: "2026-12-05",
        soLuongKhach: 10, // Room max is 4
      },
      mockBookings,
    );
    expect(result.isValid).toBe(false);
    expect(result.code).toBe("ROOM_CAPACITY_EXCEEDED");
  });

  it("TC29: validateBookingBusinessRules approves valid reservation with available dates and capacity", () => {
    const result = validateBookingBusinessRules(
      mockRoom1,
      {
        maNguoiDung: 1,
        maPhong: 1,
        ngayDen: "2026-12-01",
        ngayDi: "2026-12-05",
        soLuongKhach: 2,
      },
      mockBookings,
    );
    expect(result.isValid).toBe(true);
    expect(result.code).toBeUndefined();
  });
});
