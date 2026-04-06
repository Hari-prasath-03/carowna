import { NextRequest, NextResponse } from "next/server";
import { getVehicles } from "@/service/user/vehicles";
import { VehicleType } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type") as VehicleType | "All" | null;
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const offset = searchParams.get("offset")
    ? parseInt(searchParams.get("offset")!)
    : undefined;
  const transmission = searchParams.get("transmission") as
    | "automatic"
    | "manual"
    | undefined;
  const minPrice = searchParams.get("minPrice")
    ? parseInt(searchParams.get("minPrice")!)
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice")!)
    : undefined;
  const fuelType = searchParams.get("fuelType") || undefined;
  const limit = parseInt(searchParams.get("limit") || "5");

  const [data, error] = await getVehicles({
    type: type || "All",
    search,
    transmission,
    minPrice,
    maxPrice,
    fuelType,
    page,
    offset,
    limit,
  });

  if (error) return NextResponse.json({ error: error.reason }, { status: 500 });
  return NextResponse.json(data);
}
