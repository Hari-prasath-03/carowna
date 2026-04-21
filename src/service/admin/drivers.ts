import { CACHE_TIME, ADMIN_CACHE_TAGS } from "@/constants/cache-tags";
import { ADMIN_PAGE_SIZE } from "@/constants/others";
import QueryBuilder from "@/lib/query-builder";
import createAdminClient from "@/lib/supabase/clients/admin";
import { SystemDriverDetails, SystemDriver, SystemDriverStats } from "@/types";
import { unstable_cache } from "next/cache";

export const getDriverStats = unstable_cache(
  async (): Promise<SystemDriverStats> => {
    const sb = createAdminClient();

    const { data: drivers } = await sb.from("drivers").select("is_available");

    const totalDrivers = drivers?.length || 0;
    const onlineDrivers =
      drivers?.filter((d) => d.is_available === true).length || 0;

    return {
      totalDrivers,
      onlineDrivers,
    };
  },
  [ADMIN_CACHE_TAGS.DRIVER_STATS],
  {
    tags: [ADMIN_CACHE_TAGS.DRIVER_STATS],
    revalidate: CACHE_TIME.FREQUENT,
  },
);

export const getDrivers = unstable_cache(
  async (
    page: number = 1,
    filters?: {
      search?: string;
    },
  ): Promise<{ drivers: SystemDriver[]; total: number }> => {
    const sb = createAdminClient();

    const query = new QueryBuilder(
      sb.from("drivers").select("*", { count: "exact" }),
    )
      .paginate(page, ADMIN_PAGE_SIZE)
      .sort("created_at", false);
    if (filters?.search) query.search(["name"], filters.search);

    const { data, count, error } = await query.build();
    if (error) throw error;

    const drivers: SystemDriver[] = (data || []).map((d) => ({
      id: d.id,
      name: d.name,
      avatar_url: null,
      years_of_exp: d.years_of_exp || 0,
      rating: Number(d.rating || 0),
      is_available: !!d.is_available,
    }));

    return {
      drivers,
      total: count || 0,
    };
  },
  [ADMIN_CACHE_TAGS.DRIVERS_LIST],
  {
    tags: [ADMIN_CACHE_TAGS.DRIVERS_LIST],
    revalidate: CACHE_TIME.FREQUENT,
  },
);

export const getDriverDetails = unstable_cache(
  async (driverId: string): Promise<SystemDriverDetails | null> => {
    const sb = createAdminClient();

    const { data: driver, error } = await sb
      .from("drivers")
      .select("*")
      .eq("id", driverId)
      .single();

    if (error || !driver) return null;

    const [bookingsData, totalCount, completedCount] = await Promise.all([
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
        .eq("driver_id", driverId)
        .order("created_at", { ascending: false })
        .limit(5),

      sb
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("driver_id", driverId),

      sb
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("driver_id", driverId)
        .eq("booking_status", "COMPLETED"),
    ]);

    const { data: completedBookings } = await sb
      .from("bookings")
      .select("total_amount")
      .eq("driver_id", driverId)
      .eq("booking_status", "COMPLETED");

    const totalRevenue =
      completedBookings?.reduce((sum, b) => sum + Number(b.total_amount), 0) ||
      0;
    const totalBookings = totalCount.count || 0;
    const completedBookingsCount = completedCount.count || 0;
    const utilization =
      totalBookings > 0 ? (completedBookingsCount / totalBookings) * 100 : 0;

    return {
      id: driver.id,
      name: driver.name,
      date_of_birth: driver.date_of_birth,
      gender: driver.gender,
      years_of_exp: driver.years_of_exp,
      rating: Number(driver.rating || 0),
      price_per_day: driver.price_per_day,
      license_doc_url: driver.license_doc_url,
      is_available: !!driver.is_available,
      created_at: driver.created_at,
      performance: {
        totalRevenue,
        utilization,
        totalBookings,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recentBookings: (bookingsData.data || []).map((b: any) => ({
        id: b.id,
        user_name: b.user?.name || "Unknown User",
        start_date: b.start_date,
        end_date: b.end_date,
        total_amount: Number(b.total_amount),
        booking_status: b.booking_status,
      })),
    };
  },
  [ADMIN_CACHE_TAGS.DRIVER_DETAILS],
  {
    tags: [ADMIN_CACHE_TAGS.DRIVERS_LIST],
    revalidate: CACHE_TIME.FREQUENT,
  },
);
