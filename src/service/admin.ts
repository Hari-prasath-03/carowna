import createClient from "@/lib/supabase/clients/server";
import { ok, err } from "@/lib/error-handler";

export async function getDashboardStats() {
  const sb = await createClient();

  const [
    { count: usersCount },
    { count: vendorsCount },
    { count: vehiclesCount },
    { count: bookingsCount },
    { data: revenueData },
  ] = await Promise.all([
    sb.from("user_details").select("*", { count: "exact", head: true }),
    sb
      .from("user_details")
      .select("*", { count: "exact", head: true })
      .eq("role", "VENDOR"),
    sb.from("vehicles").select("*", { count: "exact", head: true }),
    sb.from("bookings").select("*", { count: "exact", head: true }),
    sb.from("payments").select("amount").eq("payment_status", "SUCCESS"),
  ]);

  const totalRevenue = (revenueData || []).reduce(
    (sum, p) => sum + (p.amount || 0),
    0,
  );

  return ok({
    users: usersCount || 0,
    vendors: vendorsCount || 0,
    vehicles: vehiclesCount || 0,
    bookings: bookingsCount || 0,
    revenue: totalRevenue,
  });
}

export async function getRevenueTrends() {
  const sb = await createClient();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data, error } = await sb
    .from("payments")
    .select("amount, created_at")
    .eq("payment_status", "SUCCESS")
    .gte("created_at", sixMonthsAgo.toISOString())
    .order("created_at", { ascending: true });

  if (error) return err({ reason: "FETCH_FAILED", message: error.message });

  // Group by month
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

  return ok(
    Object.entries(monthlyData).map(([name, value]) => ({ name, value })),
  );
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
      user:user_details(display_name, avatar_url),
      vehicle:vehicles(name, brand),
      vendor:user_details!vendor_id(display_name)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return err({ reason: "FETCH_FAILED", message: error.message });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookings = (data || []).map((b: any) => ({
    ...b,
    user: Array.isArray(b.user) ? b.user[0] : b.user,
    vehicle: Array.isArray(b.vehicle) ? b.vehicle[0] : b.vehicle,
    vendor: Array.isArray(b.vendor) ? b.vendor[0] : b.vendor,
  }));

  return ok(bookings);
}

export async function getPendingApprovalsCount() {
  const sb = await createClient();

  const { count, error } = await sb
    .from("vehicles")
    .select("*", { count: "exact", head: true })
    .eq("approval_status", "PENDING");

  if (error) return 0;
  return count || 0;
}
