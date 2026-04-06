"use server";

import { unstable_cache } from "next/cache";
import createAdminClient from "@/lib/supabase/clients/admin";
import { VENDOR_CACHE_TAGS, CACHE_TIME } from "@/constants/cache-tags";
import { VendorDriver, VendorDriverStats, VendorDriverDetails } from "@/types";
import { ADMIN_PAGE_SIZE } from "@/constants";
import QueryBuilder from "@/lib/query-builder";

export const getVendorDriverStats = unstable_cache(
  async (vendorId: string): Promise<VendorDriverStats> => {
    const sb = createAdminClient();

    const { data: drivers } = await sb
      .from("drivers")
      .select("approval_status, availability_status")
      .eq("vendor_id", vendorId);

    const totalDrivers = drivers?.length || 0;
    const onlineDrivers =
      drivers?.filter((d) => d.availability_status === true).length || 0;
    const pendingApprovals =
      drivers?.filter((d) => d.approval_status === "PENDING").length || 0;

    return {
      totalDrivers,
      onlineDrivers,
      pendingApprovals,
    };
  },
  [VENDOR_CACHE_TAGS.DRIVER_STATS],
  {
    tags: [VENDOR_CACHE_TAGS.DRIVERS_LIST],
    revalidate: CACHE_TIME.FREQUENT,
  },
);

export const getVendorDrivers = unstable_cache(
  async (
    vendorId: string,
    page: number = 1,
    filters?: {
      status?: string;
      search?: string;
    },
  ): Promise<{ drivers: VendorDriver[]; total: number }> => {
    const sb = createAdminClient();

    const query = new QueryBuilder(
      sb.from("drivers").select("*", { count: "exact" }),
    )
      .filter(true, "vendor_id", vendorId)
      .paginate(page, ADMIN_PAGE_SIZE)
      .sort("created_at", false);

    if (filters?.status && filters.status !== "all") {
      query.filter(true, "approval_status", filters.status.toUpperCase());
    }

    if (filters?.search) {
      query.search(["name"], filters.search);
    }

    const { data, count, error } = await query.build();

    if (error) throw error;

    const drivers: VendorDriver[] = (data || []).map((d) => ({
      id: d.id,
      name: d.name,
      avatar_url: null,
      years_of_exp: d.years_of_exp || 0,
      rating: Number(d.rating || 0),
      availability_status: !!d.availability_status,
      approval_status: d.approval_status || "PENDING",
    }));

    return {
      drivers,
      total: count || 0,
    };
  },
  [VENDOR_CACHE_TAGS.DRIVERS_LIST],
  {
    tags: [VENDOR_CACHE_TAGS.DRIVERS_LIST],
    revalidate: CACHE_TIME.FREQUENT,
  },
);

export const getVendorDriverDetails = unstable_cache(
  async (driverId: string): Promise<VendorDriverDetails | null> => {
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
      vendor_id: driver.vendor_id,
      name: driver.name,
      date_of_birth: driver.date_of_birth,
      gender: driver.gender,
      years_of_exp: driver.years_of_exp,
      rating: Number(driver.rating || 0),
      license_doc_url: driver.license_doc_url,
      approval_status: driver.approval_status,
      approval_remarks: driver.approval_remarks,
      availability_status: !!driver.availability_status,
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
  [VENDOR_CACHE_TAGS.DRIVER_DETAILS],
  {
    tags: [VENDOR_CACHE_TAGS.DRIVERS_LIST],
    revalidate: CACHE_TIME.FREQUENT,
  },
);
