"use server";

import { unstable_cache } from "next/cache";
import createAdminClient from "@/lib/supabase/clients/admin";
import { ADMIN_CACHE_TAGS, CACHE_TIME } from "@/constants/cache-tags";
import { months } from "@/constants";

export const getRevenueTrends = unstable_cache(
  async () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data, error } = await createAdminClient()
      .from("payments")
      .select("amount, created_at, bookings!inner(booking_status)")
      .eq("status", "SUCCESS")
      .neq("bookings.booking_status", "CANCELLED")
      .gte("created_at", sixMonthsAgo.toISOString())
      .order("created_at", { ascending: true });

    if (error) return [];

    const monthlyData: Record<string, number> = {};

    data.forEach((p) => {
      const date = new Date(p.created_at);
      const month = months[date.getMonth()];
      monthlyData[month] = (monthlyData[month] || 0) + p.amount;
    });

    return Object.entries(monthlyData).map(([name, value]) => ({
      name,
      value,
    }));
  },
  [ADMIN_CACHE_TAGS.REVENUE],
  { tags: [ADMIN_CACHE_TAGS.REVENUE], revalidate: CACHE_TIME.FREQUENT },
);

export const getRecentBookings = unstable_cache(
  async (limit = 5) => {
    const { data, error } = await createAdminClient()
      .from("bookings")
      .select(
        `
      id,
      created_at,
      booking_status,
      total_amount,
      user:users(name),
      vehicle:vehicles(
        name,
        brand,
        vendor:users(name)
      )
    `,
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || []).map((b: any) => ({
      ...b,
      user: b.user,
      vehicle: {
        name: b.vehicle?.name,
        brand: b.vehicle?.brand,
      },
      vendor: b.vehicle?.vendor,
    }));
  },
  [ADMIN_CACHE_TAGS.BOOKINGS],
  { tags: [ADMIN_CACHE_TAGS.BOOKINGS], revalidate: CACHE_TIME.FREQUENT },
);

export const getDashboardStats = unstable_cache(
  async () => {
    const sb = createAdminClient();

    const [
      { count: users },
      { count: vendors },
      { count: vehicles },
      { count: bookings },
      { data: revenueRow },
    ] = await Promise.all([
      sb
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("role", "USER"),
      sb
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("role", "VENDOR"),
      sb.from("vehicles").select("id", { count: "exact", head: true }),
      sb.from("bookings").select("id", { count: "exact", head: true }),
      sb
        .from("payments")
        .select("amount, bookings!inner(booking_status)")
        .neq("bookings.booking_status", "CANCELLED")
        .eq("status", "SUCCESS"),
    ]);

    return {
      users: users ?? 0,
      vendors: vendors ?? 0,
      vehicles: vehicles ?? 0,
      bookings: bookings ?? 0,
      revenue: (revenueRow ?? []).reduce((sum, r) => sum + (r.amount ?? 0), 0),
    };
  },
  [ADMIN_CACHE_TAGS.DASHBOARD_STATS],
  { tags: [ADMIN_CACHE_TAGS.DASHBOARD_STATS], revalidate: CACHE_TIME.FREQUENT },
);

export const getPendingApprovalsCount = unstable_cache(
  async () => {
    const { count, error } = await createAdminClient()
      .from("vehicles")
      .select("id", { count: "exact", head: true })
      .eq("approval_status", "PENDING");

    if (error) return 0;
    return count ?? 0;
  },
  [ADMIN_CACHE_TAGS.PENDING_APPROVALS_COUNT],
  {
    tags: [ADMIN_CACHE_TAGS.PENDING_APPROVALS_COUNT],
    revalidate: CACHE_TIME.FREQUENT,
  },
);
