"use server";

import { unstable_cache } from "next/cache";
import createAdminClient from "@/lib/supabase/clients/admin";
import { VENDOR_CACHE_TAGS, CACHE_TIME } from "@/constants/cache-tags";
import {
  VendorVehicle,
  VendorVehicleStats,
  VendorVehicleDetails,
} from "@/types";
import { ADMIN_PAGE_SIZE } from "@/constants";
import QueryBuilder from "@/lib/query-builder";

export const getVendorVehicleStats = unstable_cache(
  async (vendorId: string): Promise<VendorVehicleStats> => {
    const sb = createAdminClient();

    const { data: vehicles } = await sb
      .from("vehicles")
      .select("approval_status, is_available")
      .eq("vendor_id", vendorId);

    const totalVehicles = vehicles?.length || 0;
    const onlineVehicles =
      vehicles?.filter((v) => v.is_available === true).length || 0;
    const pendingApprovals =
      vehicles?.filter((v) => v.approval_status === "PENDING").length || 0;

    return {
      totalVehicles,
      onlineVehicles,
      pendingApprovals,
    };
  },
  [VENDOR_CACHE_TAGS.VEHICLE_STATS, "getVendorVehicleStats"],
  {
    tags: [VENDOR_CACHE_TAGS.VEHICLES_LIST],
    revalidate: CACHE_TIME.FREQUENT,
  },
);

export const getVendorVehicles = unstable_cache(
  async (
    vendorId: string,
    page: number = 1,
    filters?: {
      status?: string;
      type?: string;
      search?: string;
    },
  ): Promise<{ vehicles: VendorVehicle[]; total: number }> => {
    const sb = createAdminClient();

    const query = new QueryBuilder(
      sb.from("vehicles").select("*", { count: "exact" }),
    )
      .filter(true, "vendor_id", vendorId)
      .paginate(page, ADMIN_PAGE_SIZE)
      .sort("created_at", false);

    if (filters?.status && filters.status !== "all") {
      query.filter(true, "approval_status", filters.status.toUpperCase());
    }

    if (filters?.type && filters.type !== "all") {
      query.filter(true, "vehicle_type", filters.type);
    }

    if (filters?.search) {
      query.search(["name", "brand", "registration_number"], filters.search);
    }

    const { data, count, error } = await query.build();

    if (error) throw error;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vehicles: VendorVehicle[] = (data || []).map((v: any) => ({
      id: v.id,
      name: v.name,
      brand: v.brand,
      vehicle_type: v.vehicle_type,
      registration_number: v.registration_number,
      price_per_day: Number(v.price_per_day),
      approval_status: v.approval_status,
      images: v.images,
      last_rented: null,
      is_available: v.is_available,
    }));

    return {
      vehicles,
      total: count || 0,
    };
  },
  [VENDOR_CACHE_TAGS.VEHICLES_LIST, "getVendorVehicles"],
  {
    tags: [VENDOR_CACHE_TAGS.VEHICLES_LIST],
    revalidate: CACHE_TIME.FREQUENT,
  },
);

export const getVendorVehicleDetails = unstable_cache(
  async (vehicleId: string): Promise<VendorVehicleDetails | null> => {
    const sb = createAdminClient();

    const { data: vehicle, error } = await sb
      .from("vehicles")
      .select("*")
      .eq("id", vehicleId)
      .single();

    if (error || !vehicle) return null;

    const [
      { data: bookings },
      { data: vendorBookings },
      { count: totalBookings },
      { count: completedBookings },
    ] = await Promise.all([
      sb
        .from("bookings")
        .select(
          `
          id,
          start_date,
          end_date,
          booking_status,
          total_amount,
          user:users!bookings_user_id_fkey(name)
        `,
        )
        .eq("vehicle_id", vehicleId)
        .order("created_at", { ascending: false })
        .limit(5),

      sb.from("bookings").select("id").eq("vehicle_id", vehicleId),

      sb
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("vehicle_id", vehicleId),

      sb
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("vehicle_id", vehicleId)
        .eq("booking_status", "COMPLETED"),
    ]);

    const bookingIds = vendorBookings?.map((b) => b.id) || [];

    const { data: payments } = await sb
      .from("payments")
      .select("amount")
      .eq("status", "SUCCESS")
      .in("booking_id", bookingIds);

    const totalRevenue =
      payments?.reduce((acc, p) => acc + Number(p.amount), 0) || 0;

    const countTotal = totalBookings || 0;
    const countCompleted = completedBookings || 0;
    const utilization = countTotal
      ? Math.round((countCompleted / countTotal) * 100)
      : 0;

    return {
      id: vehicle.id,
      vendor_id: vehicle.vendor_id,
      name: vehicle.name,
      brand: vehicle.brand,
      vehicle_type: vehicle.vehicle_type,
      transmission: vehicle.transmission,
      fuel_type: vehicle.fuel_type,
      capacity: vehicle.capacity,
      price_per_day: Number(vehicle.price_per_day),
      images: vehicle.images,
      registration_number: vehicle.registration_number,
      approval_status: vehicle.approval_status,
      is_available: vehicle.is_available,
      created_at: vehicle.created_at,
      rc_doc_url: vehicle.rc_doc_url,
      insurance_doc_url: vehicle.insurance_doc_url,
      rto_verification_doc_url: vehicle.rto_verification_doc_url,
      performance: {
        totalRevenue: totalRevenue,
        utilization: utilization,
        totalBookings: countTotal,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recentBookings: (bookings || []).map((b: any) => ({
        id: b.id,
        user_name: b.user?.name || "Unknown User",
        start_date: b.start_date,
        end_date: b.end_date,
        total_amount: Number(b.total_amount),
        booking_status: b.booking_status,
      })),
    };
  },
  [VENDOR_CACHE_TAGS.VEHICLE_DETAILS, "getVendorVehicleDetails"],
  {
    tags: [VENDOR_CACHE_TAGS.VEHICLE_DETAILS],
    revalidate: CACHE_TIME.FREQUENT,
  },
);
