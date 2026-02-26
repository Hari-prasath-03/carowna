import { publicSupabase } from "@/lib/supabase/public";
import { err, ok } from "@/lib/error-handler";
import QueryBuilder from "@/lib/query-builder";
import { Vehicle, VehicleType } from "@/types";
import { unstable_cache } from "next/cache";

export const getVehicles = (params?: {
  type?: VehicleType | "All";
  search?: string;
  transmission?: "automatic" | "manual";
  minPrice?: number;
  maxPrice?: number;
  fuelType?: string;
  page?: number;
  offset?: number;
  limit?: number;
}) => {
  const cacheKey = [
    "vehicles-list",
    params?.type || "All",
    params?.search || "",
    params?.transmission || "any",
    params?.minPrice?.toString() || "0",
    params?.maxPrice?.toString() || "inf",
    params?.fuelType || "any",
    params?.page?.toString() || "1",
    params?.offset?.toString() || "0",
    params?.limit?.toString() || "5",
  ];

  return unstable_cache(
    async () => {
      const sb = publicSupabase;
      const limit = params?.limit || 5;
      const start =
        params?.offset !== undefined
          ? params.offset
          : ((params?.page || 1) - 1) * limit;
      const end = start + limit - 1;

      const query = sb.from("vehicles").select("*", { count: "exact" });
      const builder = new QueryBuilder(query);

      builder
        .filter(true, "approval_status", "APPROVED")
        .filter(true, "availability_status", "AVAILABLE")
        .filter(
          !!params?.type && params.type !== "All",
          "vehicle_type",
          params?.type?.toLowerCase(),
        )
        .filter(!!params?.transmission, "transmission", params?.transmission)
        .filter(!!params?.fuelType, "fuel_type", params?.fuelType)
        .filter(!!params?.minPrice, "price_per_day", params?.minPrice, "gte")
        .filter(!!params?.maxPrice, "price_per_day", params?.maxPrice, "lte")
        .search(["name", "brand"], params?.search || "")
        .sort("created_at", false)
        .range(start, end);

      const { data, error, success } = await builder.build();

      if (!success || error) {
        console.error("Error fetching vehicles:", error);
        return err({ reason: "Failed to fetch vehicles" });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vehicles: Vehicle[] = (data || []).map((v: any) => ({
        id: v.id,
        name: v.name,
        brand: v.brand,
        vehicle_type: v.vehicle_type,
        transmission: v.transmission,
        price_per_day: v.price_per_day,
        capacity: v.capacity,
        fuel_type: v.fuel_type,
        images: v.images || [],
        rating: 4.5 + Math.random() * 0.5,
        vendor_id: v.vendor_id,
        availability_status: v.availability_status,
        approval_status: v.approval_status,
      }));

      return ok(vehicles);
    },
    cacheKey,
    {
      revalidate: 60,
      tags: ["vehicles"],
    },
  )();
};

export const getVehicleById = (id: string) => {
  return unstable_cache(
    async () => {
      const sb = publicSupabase;
      const { data, error } = await sb
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        return err({ reason: "Vehicle not found" });
      }

      const vehicle: Vehicle = {
        id: data.id,
        name: data.name,
        brand: data.brand,
        vehicle_type: data.vehicle_type,
        transmission: data.transmission,
        price_per_day: data.price_per_day,
        capacity: data.capacity,
        fuel_type: data.fuel_type,
        images: data.images || [],
        rating: 4.5 + Math.random() * 0.5,
        insurance_doc_url: data.insurance_doc_url,
        rc_doc_url: data.rc_doc_url,
        rto_verification_doc_url: data.rto_verification_doc_url,
        availability_status: data.availability_status,
        approval_status: data.approval_status,
        vendor_id: data.vendor_id,
      };

      return ok(vehicle);
    },
    ["vehicle-by-id", id],
    {
      revalidate: 3600,
      tags: ["vehicle", id],
    },
  )();
};
