"use server";

import { unstable_cache } from "next/cache";
import createAdminClient from "@/lib/supabase/clients/admin";
import { CACHE_TAGS, CACHE_TIME } from "@/constants/cache-tags";
import {
  AdminBookingListItem,
  AdminBookingStats,
  AdminBookingDetails,
} from "@/types";
import QueryBuilder from "@/lib/query-builder";

export const getAdminBookingStats = unstable_cache(
  async (): Promise<AdminBookingStats> => {
    const sb = createAdminClient();
    const { data, error } = await sb.from("bookings").select("booking_status");

    if (error || !data) {
      console.error("Error fetching booking stats:", error);
      return {
        totalBookings: 0,
        activeTrips: 0,
        pendingConfirmations: 0,
        cancelled: 0,
      };
    }

    const total = data.length;
    let active = 0;
    let pending = 0;
    let cancelled = 0;

    for (const b of data) {
      if (b.booking_status === "ONGOING" || b.booking_status === "CONFIRMED")
        active++;
      else if (b.booking_status === "REQUESTED") pending++;
      else if (b.booking_status === "CANCELLED") cancelled++;
    }

    return {
      totalBookings: total,
      activeTrips: active,
      pendingConfirmations: pending,
      cancelled: cancelled,
    };
  },
  [CACHE_TAGS.ADMIN_BOOKING_STATS],
  { tags: [CACHE_TAGS.ADMIN_BOOKING_STATS], revalidate: CACHE_TIME.ADMIN },
);

export const getAdminBookings = unstable_cache(
  async (page: number = 1, size: number = 5, statusFilter?: string) => {
    const sb = createAdminClient();

    const builder = new QueryBuilder(
      sb.from("bookings").select(
        `
          id, start_date, end_date, booking_status, created_at,
          users!inner(name),
          vehicles!inner(name, brand, users(name))
        `,
        { count: "exact" },
      ),
    );

    builder.filter(
      !!statusFilter && statusFilter !== "ALL",
      "booking_status",
      statusFilter,
    );

    builder.sort("created_at", false);
    builder.paginate(page, size);

    const { data: bookingsData, error, count } = await builder.build();

    if (error || !bookingsData) {
      console.error("Error fetching bookings:", error);
      return { bookings: [], total: 0, totalPages: 0 };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bookings: AdminBookingListItem[] = bookingsData.map((b: any) => ({
      id: b.id,
      user_name: b.users?.name,
      vehicle: {
        name: b.vehicles?.name,
        brand: b.vehicles?.brand,
      },
      vendor_name: b.vehicles?.users?.name,
      start_date: b.start_date,
      end_date: b.end_date,
      total_amount: b.total_amount ?? 0,
      booking_status: b.booking_status ?? "UNKNOWN",
    }));

    const total = count ?? 0;
    return {
      bookings,
      total,
      totalPages: Math.ceil(total / size),
    };
  },
  [CACHE_TAGS.ADMIN_BOOKINGS],
  { tags: [CACHE_TAGS.ADMIN_BOOKINGS], revalidate: CACHE_TIME.ADMIN },
);

export const getAdminBookingDetails = unstable_cache(
  async (bookingId: string): Promise<AdminBookingDetails | null> => {
    const { data, error } = await createAdminClient()
      .from("bookings")
      .select(
        `
        id, start_date, end_date, location_pickup, location_drop, booking_status, total_amount, initial_amount,
        user:users!bookings_user_id_fkey(id, profile_url),
        vehicle:vehicles!inner(id),
        driver:drivers(id)
      `,
      )
      .eq("id", bookingId)
      .single();

    if (error || !data) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const b: any = data;

    return {
      id: b.id,
      start_date: b.start_date,
      end_date: b.end_date,
      location_pickup: b.location_pickup,
      location_drop: b.location_drop,
      booking_status: b.booking_status,
      total_amount: b.total_amount ?? 0,
      initial_amount: b.initial_amount ?? 0,
      user: {
        id: b.user?.id ?? "",
        profile_url: b.user?.profile_url ?? null,
      },
      vehicle_id: b.vehicle?.id ?? "",
      driver_id: b.driver?.id ?? null,
    };
  },
  [CACHE_TAGS.ADMIN_BOOKINGS, "admin-booking-details"],
  { tags: [CACHE_TAGS.ADMIN_BOOKINGS], revalidate: CACHE_TIME.ADMIN },
);
