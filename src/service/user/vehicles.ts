import publicSupabase from "@/lib/supabase/clients/public";
import { err, ok } from "@/lib/error-handler";
import QueryBuilder from "@/lib/query-builder";
import { Vehicle, VehicleType } from "@/types";
import { unstable_cache } from "next/cache";
import { USER_CACHE_TAGS, CACHE_TIME } from "@/constants/cache-tags";

type VehicleParams = {
  type?: VehicleType | "All";
  search?: string;
  transmission?: "automatic" | "manual";
  minPrice?: number;
  maxPrice?: number;
  fuelType?: string;
  page?: number;
  offset?: number;
  limit?: number;
};

const _getVehicles = unstable_cache(
  async (params: VehicleParams = {}) => {
    const limit = params.limit ?? 5;

    const start =
      params.offset !== undefined
        ? params.offset
        : ((params.page ?? 1) - 1) * limit;

    const end = start + limit - 1;

    const query = publicSupabase.from("vehicles").select(
      `
      id,
      name,
      brand,
      vehicle_type,
      transmission,
      price_per_day,
      capacity,
      fuel_type,
      images,
      vendor_id,
      approval_status,
      created_at
      `,
      { count: "exact" },
    );

    const builder = new QueryBuilder(query);

    builder
      .filter(true, "approval_status", "APPROVED")
      .filter(true, "is_available", true)
      .filter(
        !!params.type && params.type !== "All",
        "vehicle_type",
        params.type?.toLowerCase(),
      )
      .filter(!!params.transmission, "transmission", params.transmission)
      .filter(!!params.fuelType, "fuel_type", params.fuelType)
      .filter(!!params.minPrice, "price_per_day", params.minPrice, "gte")
      .filter(!!params.maxPrice, "price_per_day", params.maxPrice, "lte")
      .search(["name", "brand"], params.search ?? "")
      .sort("created_at", false)
      .range(start, end);

    const { data, error, success } = await builder.build();

    if (!success || error) {
      console.error("Error fetching vehicles:", error);
      return err({ reason: "Failed to fetch vehicles" });
    }

    const vehicleData = data.map((v) => ({
      ...v,
      rating: 4.5 + Math.random() * 0.5,
    }));

    return ok(vehicleData as Vehicle[]);
  },
  [USER_CACHE_TAGS.VEHICLES_LIST, "getVehicles"],
  {
    revalidate: CACHE_TIME.RARE,
    tags: [USER_CACHE_TAGS.VEHICLES_LIST],
  },
);

export function getVehicles(params?: VehicleParams) {
  return _getVehicles(params ?? {});
}

const _getVehicleById = unstable_cache(
  async (id: string) => {
    const { data, error } = await publicSupabase
      .from("vehicles")
      .select(
        `
        id,
        name,
        brand,
        vehicle_type,
        transmission,
        price_per_day,
        capacity,
        fuel_type,
        images,
        insurance_doc_url,
        rc_doc_url,
        rto_verification_doc_url,
        approval_status,
        vendor_id
      `,
      )
      .eq("id", id)
      .eq("approval_status", "APPROVED")
      .eq("is_available", true)
      .single();

    if (error || !data) {
      return err({ reason: "Vehicle not found" });
    }

    const vehicle: Vehicle = {
      ...data,
      rating: 4.5 + Math.random() * 0.5,
    };

    return ok(vehicle);
  },
  [USER_CACHE_TAGS.VEHICLE_DETAILS, "getVehicleById"],
  {
    revalidate: CACHE_TIME.RARE,
    tags: [USER_CACHE_TAGS.VEHICLE_DETAILS],
  },
);

export function getVehicleById(id: string) {
  return _getVehicleById(id);
}

const _getVehiclePriceRange = unstable_cache(
  async () => {
    const { data, error } = await publicSupabase
      .from("vehicles")
      .select("price_per_day")
      .eq("approval_status", "APPROVED")
      .eq("is_available", true);

    if (error || !data?.length) {
      return ok({ min: 0, max: 1000 });
    }

    const prices = data.map((v) => v.price_per_day);

    return ok({
      min: Math.min(...prices),
      max: Math.max(...prices),
    });
  },
  [USER_CACHE_TAGS.PRICE_RANGE, "getVehiclePriceRange"],
  {
    revalidate: CACHE_TIME.RARE,
    tags: [USER_CACHE_TAGS.PRICE_RANGE],
  },
);

export function getVehiclePriceRange() {
  return _getVehiclePriceRange();
}
