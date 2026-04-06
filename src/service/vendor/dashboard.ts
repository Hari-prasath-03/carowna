"use server";

import { unstable_cache } from "next/cache";
import createAdminClient from "@/lib/supabase/clients/admin";
import { VENDOR_CACHE_TAGS, CACHE_TIME } from "@/constants/cache-tags";
import { VendorDashboardStats, VendorRecentBooking } from "@/types";

export const getVendorDashboardStats = unstable_cache(
  async (vendorId: string): Promise<VendorDashboardStats> => {
    const sb = createAdminClient();

    const [
      { count: totalVehicles },
      { count: activeBookings },
      { count: upcomingBookings },
      { count: availableDrivers },
      { data: payments },
    ] = await Promise.all([
      sb
        .from("vehicles")
        .select("id", { count: "exact", head: true })
        .eq("vendor_id", vendorId),

      sb
        .from("bookings")
        .select("id, vehicle:vehicles!inner(vendor_id)", {
          count: "exact",
          head: true,
        })
        .eq("booking_status", "REQUESTED")
        .eq("vehicle.vendor_id", vendorId),

      sb
        .from("bookings")
        .select("id, vehicle:vehicles!inner(vendor_id)", {
          count: "exact",
          head: true,
        })
        .gte("start_date", new Date().toISOString())
        .lte(
          "start_date",
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        )
        .eq("vehicle.vendor_id", vendorId),

      sb
        .from("drivers")
        .select("id", { count: "exact", head: true })
        .eq("vendor_id", vendorId)
        .eq("approval_status", "APPROVED"),

      sb
        .from("payments")
        .select("amount, booking:bookings!inner(vehicle:vehicles!inner(id))")
        .eq("status", "SUCCESS")
        .eq("booking.vehicle.vendor_id", vendorId),
    ]);

    const earnings =
      payments?.reduce((acc, p) => acc + Number(p.amount), 0) || 0;

    return {
      totalVehicles: totalVehicles || 0,
      activeBookings: activeBookings || 0,
      upcomingBookings: upcomingBookings || 0,
      availableDrivers: availableDrivers || 0,
      totalEarnings: earnings,
    };
  },
  [VENDOR_CACHE_TAGS.DASHBOARD_STATS, "getVendorDashboardStats"],
  {
    tags: [VENDOR_CACHE_TAGS.DASHBOARD_STATS],
    revalidate: CACHE_TIME.FREQUENT,
  },
);

export const getVendorRecentBookings = unstable_cache(
  async (vendorId: string): Promise<VendorRecentBooking[]> => {
    const sb = createAdminClient();

    const { data: vehicles } = await sb
      .from("vehicles")
      .select("id")
      .eq("vendor_id", vendorId);
    const vehicleIds = vehicles?.map((v) => v.id) || [];

    if (vehicleIds.length === 0) {
      return [];
    }

    const { data: bookingsData } = await sb
      .from("bookings")
      .select(
        `
        id,
        start_date,
        end_date,
        created_at,
        booking_status,
        total_amount,
        vehicle:vehicles(name, brand)
      `,
      )
      .in("vehicle_id", vehicleIds)
      .order("created_at", { ascending: false })
      .limit(5);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (bookingsData || []).map((b: any) => ({
      id: b.id,
      vehicle_name: b.vehicle?.name || "Unknown Vehicle",
      vehicle_brand: b.vehicle?.brand || null,
      start_date: b.start_date,
      end_date: b.end_date,
      created_at: b.created_at,
      booking_status: b.booking_status,
      total_amount: Number(b.total_amount),
    }));
  },
  [VENDOR_CACHE_TAGS.RECENT_BOOKINGS, "getVendorRecentBookings"],
  {
    tags: [VENDOR_CACHE_TAGS.RECENT_BOOKINGS],
    revalidate: CACHE_TIME.FREQUENT,
  },
);
