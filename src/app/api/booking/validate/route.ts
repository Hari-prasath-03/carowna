import { NextRequest, NextResponse } from "next/server";
import { validateBookingConstraints } from "@/service/user/bookings";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get("vehicleId");
  const driverId = searchParams.get("driverId") || null;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!vehicleId || !startDate || !endDate) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  const [, err] = await validateBookingConstraints({
    vehicleId,
    driverId,
    startDate,
    endDate,
  });

  if (err) {
    return NextResponse.json(
      {
        isValid: false,
        reason: err.reason,
        message: (err as { message?: string }).message || err.reason,
      },
      { status: 200 },
    );
  }

  return NextResponse.json({ isValid: true }, { status: 200 });
}
