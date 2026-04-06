"use server";

import { unstable_cache } from "next/cache";
import createAdminClient from "@/lib/supabase/clients/admin";
import { ADMIN_CACHE_TAGS, CACHE_TIME } from "@/constants/cache-tags";
import {
  Vendor,
  VendorDetailStats,
  VendorProfile,
  VendorStats,
  VendorVehicle,
} from "@/types";
import { ADMIN_PAGE_SIZE } from "@/constants";

export const getVendorStats = unstable_cache(
  async (): Promise<VendorStats> => {
    const sb = createAdminClient();

    const [
      { count: total },
      { count: bikes },
      { count: cars },
      { count: luxury },
    ] = await Promise.all([
      sb
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("role", "VENDOR"),
      sb
        .from("vehicles")
        .select("id", { count: "exact", head: true })
        .eq("vehicle_type", "bike"),
      sb
        .from("vehicles")
        .select("id", { count: "exact", head: true })
        .eq("vehicle_type", "car"),
      sb
        .from("vehicles")
        .select("id", { count: "exact", head: true })
        .eq("vehicle_type", "luxury"),
    ]);

    return {
      total: total ?? 0,
      bikes: bikes ?? 0,
      cars: cars ?? 0,
      luxury: luxury ?? 0,
    };
  },
  [ADMIN_CACHE_TAGS.VENDORS_STATS],
  { tags: [ADMIN_CACHE_TAGS.VENDORS_STATS], revalidate: CACHE_TIME.FREQUENT },
);

export const getVendors = unstable_cache(
  async (page: number = 1, size: number = ADMIN_PAGE_SIZE) => {
    const from = (page - 1) * size;
    const to = from + size - 1;

    const { data, error, count } = await createAdminClient()
      .from("users")
      .select(
        `id, name, email, profile_url, created_at, vehicles(vehicle_type)`,
        { count: "exact" },
      )
      .eq("role", "VENDOR")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error || !data) return { vendors: [], total: 0, totalPages: 0 };

    const vendors: Vendor[] = data.map((vendor) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vehicles = (vendor.vehicles as any[]) ?? [];
      return {
        id: vendor.id,
        name: vendor.name ?? "Unknown",
        email: vendor.email ?? "",
        profile_url: vendor.profile_url ?? null,
        created_at: vendor.created_at,
        total: vehicles.length,
        bikes: vehicles.filter((v) => v.vehicle_type === "bike").length,
        cars: vehicles.filter((v) => v.vehicle_type === "car").length,
        luxury: vehicles.filter((v) => v.vehicle_type === "luxury").length,
      };
    });

    const total = count ?? 0;
    return { vendors, total, totalPages: Math.ceil(total / size) };
  },
  [ADMIN_CACHE_TAGS.VENDORS_LIST],
  { tags: [ADMIN_CACHE_TAGS.VENDORS_LIST], revalidate: CACHE_TIME.FREQUENT },
);

export const getVendorProfile = unstable_cache(
  async (vendorId: string): Promise<VendorProfile | null> => {
    const { data, error } = await createAdminClient()
      .from("users")
      .select(
        "id, name, email, profile_url, native_location, mobile_no, date_of_birth, gender, created_at",
      )
      .eq("id", vendorId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name ?? "Unknown",
      email: data.email ?? "",
      profile_url: data.profile_url ?? null,
      native_location: data.native_location ?? null,
      mobile_no: data.mobile_no ?? null,
      date_of_birth: data.date_of_birth ?? null,
      gender: data.gender ?? null,
      created_at: data.created_at,
    };
  },
  [ADMIN_CACHE_TAGS.VENDOR_PROFILE],
  { tags: [ADMIN_CACHE_TAGS.VENDOR_PROFILE], revalidate: CACHE_TIME.FREQUENT },
);

export const getVendorDetailStats = unstable_cache(
  async (vendorId: string): Promise<VendorDetailStats> => {
    const sb = createAdminClient();

    const { data: vehicleRows } = await sb
      .from("vehicles")
      .select("id")
      .eq("vendor_id", vendorId);

    const vehicleIds = (vehicleRows ?? []).map((v) => v.id);

    if (vehicleIds.length === 0) {
      return { totalVehicles: 0, totalBookings: 0, totalEarnings: 0 };
    }

    const { data: bookings, count } = await sb
      .from("bookings")
      .select("id", { count: "exact" })
      .in("vehicle_id", vehicleIds);

    const bookingIds = (bookings ?? []).map((b) => b.id);

    const { data: payments } = await sb
      .from("payments")
      .select("amount")
      .in("booking_id", bookingIds)
      .eq("status", "SUCCESS");

    const totalEarnings = (payments ?? []).reduce(
      (sum, p) => sum + (p.amount ?? 0),
      0,
    );

    return {
      totalVehicles: vehicleIds.length,
      totalBookings: count ?? 0,
      totalEarnings,
    };
  },
  [ADMIN_CACHE_TAGS.VENDOR_DETAIL_STATS],
  {
    tags: [ADMIN_CACHE_TAGS.VENDOR_DETAIL_STATS],
    revalidate: CACHE_TIME.FREQUENT,
  },
);

export const getVendorVehicles = unstable_cache(
  async (vendorId: string, page = 1, size = ADMIN_PAGE_SIZE) => {
    const sb = createAdminClient();
    const from = (page - 1) * size;
    const to = from + size - 1;

    const { data: vehicleRows, count } = await sb
      .from("vehicles")
      .select(
        "id, name, brand, vehicle_type, registration_number, price_per_day, approval_status, images",
        { count: "exact" },
      )
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!vehicleRows || vehicleRows.length === 0) {
      return { vehicles: [], total: 0, totalPages: 0 };
    }

    const vehicleIds = vehicleRows.map((v) => v.id);

    const { data: bookingRows } = await sb
      .from("bookings")
      .select("vehicle_id, start_date, end_date, booking_status")
      .in("vehicle_id", vehicleIds)
      .neq("booking_status", "CANCELLED")
      .order("start_date", { ascending: false });

    const today = new Date().toISOString().split("T")[0];
    const lastRentedMap: Record<string, string> = {};
    const rentedSet = new Set<string>();

    for (const b of bookingRows ?? []) {
      if (!lastRentedMap[b.vehicle_id]) {
        lastRentedMap[b.vehicle_id] = b.start_date;
      }
      if (b.start_date <= today && b.end_date >= today) {
        rentedSet.add(b.vehicle_id);
      }
    }

    const vehicles: VendorVehicle[] = vehicleRows.map((v) => ({
      id: v.id,
      name: v.name,
      brand: v.brand ?? null,
      vehicle_type: v.vehicle_type,
      registration_number: v.registration_number,
      price_per_day: v.price_per_day,
      approval_status: v.approval_status,
      images: v.images ?? null,
      last_rented: lastRentedMap[v.id] ?? null,
      is_available: !rentedSet.has(v.id),
    }));

    const total = count ?? 0;
    return {
      vehicles,
      total,
      totalPages: Math.ceil(total / size),
    };
  },
  [ADMIN_CACHE_TAGS.VENDOR_VEHICLES],
  { tags: [ADMIN_CACHE_TAGS.VENDOR_VEHICLES], revalidate: CACHE_TIME.FREQUENT },
);
