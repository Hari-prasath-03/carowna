"use server";

import { unstable_cache } from "next/cache";
import createAdminClient from "@/lib/supabase/clients/admin";
import { CACHE_TAGS, CACHE_TIME } from "@/constants/cache-tags";
import { months } from "@/constants";

export const getRevenueTrends = unstable_cache(
  async () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data, error } = await createAdminClient()
      .from("payments")
      .select("amount, created_at")
      .eq("status", "SUCCESS")
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
  [CACHE_TAGS.REVENUE],
  { tags: [CACHE_TAGS.REVENUE], revalidate: CACHE_TIME.ADMIN },
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
    const bookings = (data || []).map((b: any) => ({
      ...b,
      user: b.user,
      vehicle: {
        name: b.vehicle?.name,
        brand: b.vehicle?.brand,
      },
      vendor: b.vehicle?.vendor,
    }));

    return bookings;
  },
  [CACHE_TAGS.BOOKINGS],
  { tags: [CACHE_TAGS.BOOKINGS], revalidate: CACHE_TIME.ADMIN },
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
      sb.from("payments").select("amount").eq("status", "SUCCESS"),
    ]);

    return {
      users: users ?? 0,
      vendors: vendors ?? 0,
      vehicles: vehicles ?? 0,
      bookings: bookings ?? 0,
      revenue: (revenueRow ?? []).reduce((sum, r) => sum + (r.amount ?? 0), 0),
    };
  },
  [CACHE_TAGS.STATS],
  { tags: [CACHE_TAGS.STATS], revalidate: CACHE_TIME.ADMIN },
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
  [CACHE_TAGS.APPROVAL_COUNT],
  { tags: [CACHE_TAGS.APPROVAL_COUNT], revalidate: CACHE_TIME.ADMIN },
);
