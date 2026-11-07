import { NextResponse } from "next/server";
import { getLocations, getAllRooms } from "@/app/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const loc = await getLocations();
    const rooms = await getAllRooms();
    return NextResponse.json({
      success: true,
      envBaseUrl: process.env.NEXT_PUBLIC_API_URL,
      locationsCount: Array.isArray(loc?.content) ? loc.content.length : 0,
      roomsCount: Array.isArray(rooms?.content) ? rooms.content.length : 0,
      firstRoom: Array.isArray(rooms?.content) ? rooms.content[0]?.tenPhong : null,
    });
  } catch (err: unknown) {
    const error = err as {
      message?: string;
      code?: string;
      response?: { status?: number; data?: unknown };
    };
    return NextResponse.json({
      success: false,
      envBaseUrl: process.env.NEXT_PUBLIC_API_URL,
      error: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
}