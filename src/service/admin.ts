"use server";

import publicSupabase from "@/lib/supabase/clients/public";
import createClient from "@/lib/supabase/clients/server";
import { unstable_cache } from "next/cache";

export async function getRevenueTrends() {
  const sb = await createClient();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data, error } = await sb
    .from("payments")
    .select("amount, created_at")
    .eq("status", "SUCCESS")
    .gte("created_at", sixMonthsAgo.toISOString())
    .order("created_at", { ascending: true });

  if (error) return [];

  const monthlyData: Record<string, number> = {};
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  data.forEach((p) => {
    const date = new Date(p.created_at);
    const month = months[date.getMonth()];
    monthlyData[month] = (monthlyData[month] || 0) + p.amount;
  });

  return Object.entries(monthlyData).map(([name, value]) => ({ name, value }));
}

export async function getRecentBookings(limit = 5) {
  const sb = await createClient();

  const { data, error } = await sb
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
}

export const getDashboardStats = unstable_cache(
  async () => {
    const sb = publicSupabase;

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
  ["dashboard-stats"],
  { revalidate: 300 },
);

export const getPendingApprovalsCount = unstable_cache(
  async () => {
    const { count, error } = await publicSupabase
      .from("vehicles")
      .select("id", { count: "exact", head: true })
      .eq("approval_status", "PENDING");

    if (error) return 0;
    return count ?? 0;
  },
  ["pending-approvals-count"],
  { revalidate: 300 },
);
