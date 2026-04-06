"use server";

import { unstable_cache } from "next/cache";
import createAdminClient from "@/lib/supabase/clients/admin";
import { ADMIN_CACHE_TAGS, CACHE_TIME } from "@/constants/cache-tags";
import {
  UserStats,
  UserListItem,
  AdminUserProfile,
  UserBookingHistoryItem,
} from "@/types";
import { ADMIN_PAGE_SIZE } from "@/constants";

export const getUserStats = unstable_cache(
  async (): Promise<UserStats> => {
    const sb = createAdminClient();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: users } = await sb
      .from("users")
      .select("created_at")
      .eq("role", "USER");

    const totalUsers = users?.length ?? 0;
    const newUsersThisMonth =
      users?.filter((u) => new Date(u.created_at) >= thirtyDaysAgo).length ?? 0;

    return {
      totalUsers: totalUsers ?? 0,
      activeUsers: totalUsers ?? 0,
      newUsersThisMonth: newUsersThisMonth ?? 0,
    };
  },
  [ADMIN_CACHE_TAGS.USERS_STATS],
  { tags: [ADMIN_CACHE_TAGS.USERS_STATS], revalidate: CACHE_TIME.FREQUENT },
);

export const getUsers = unstable_cache(
  async (page = 1) => {
    const from = (page - 1) * ADMIN_PAGE_SIZE;
    const to = from + ADMIN_PAGE_SIZE - 1;

    const sb = createAdminClient();

    const { data: usersData, count } = await sb
      .from("users")
      .select(
        "id, name, email, profile_url, created_at, last_active_at, bookings(count)",
        {
          count: "exact",
        },
      )
      .eq("role", "USER")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!usersData || usersData.length === 0) {
      return { users: [], total: 0, totalPages: 0 };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const users: UserListItem[] = usersData.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      profile_url: u.profile_url || null,
      total_bookings: u.bookings?.[0]?.count ?? 0,
      created_at: u.created_at,
      last_active_at: u.last_active_at || null,
    }));

    const total = count ?? 0;
    return {
      users,
      total,
      totalPages: Math.ceil(total / ADMIN_PAGE_SIZE),
    };
  },
  [ADMIN_CACHE_TAGS.USERS_LIST],
  { tags: [ADMIN_CACHE_TAGS.USERS_LIST], revalidate: CACHE_TIME.FREQUENT },
);

export const getUserDetails = unstable_cache(
  async (userId: string): Promise<AdminUserProfile | null> => {
    const sb = createAdminClient();

    const { data: user } = await sb
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!user) return null;

    const { data: bookings } = await sb
      .from("bookings")
      .select("booking_status, payments(amount, status)")
      .eq("user_id", userId);

    let totalSpent = 0;
    let totalBookings = 0;
    let totalCancelled = 0;

    if (bookings) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bookings.forEach((b: any) => {
        if (b.booking_status === "CANCELLED") {
          totalCancelled++;
        } else {
          totalBookings++;
        }

        if (
          b.booking_status !== "CANCELLED" &&
          b.payments &&
          Array.isArray(b.payments)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          b.payments.forEach((p: any) => {
            if (p.status === "SUCCESS") {
              totalSpent += Number(p.amount) || 0;
            }
          });
        }
      });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profile_url: user.profile_url || null,
      mobile_no: user.mobile_no || null,
      date_of_birth: user.date_of_birth || null,
      native_location: user.native_location || null,
      gender: user.gender || null,
      created_at: user.created_at,
      total_bookings: totalBookings,
      total_cancelled: totalCancelled,
      total_spent: totalSpent,
    };
  },
  [ADMIN_CACHE_TAGS.USER_DETAILS],
  { tags: [ADMIN_CACHE_TAGS.USER_DETAILS], revalidate: CACHE_TIME.FREQUENT },
);

export const getUserBookings = unstable_cache(
  async (userId: string, page = 1) => {
    const from = (page - 1) * ADMIN_PAGE_SIZE;
    const to = from + ADMIN_PAGE_SIZE - 1;

    const sb = createAdminClient();

    const { data: bookingsData, count } = await sb
      .from("bookings")
      .select(
        "id, start_date, end_date, location_pickup, location_drop, booking_status, total_amount, created_at, vehicles(name, brand, images)",
        { count: "exact" },
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!bookingsData || bookingsData.length === 0) {
      return { bookings: [], total: 0, totalPages: 0 };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bookings: UserBookingHistoryItem[] = bookingsData.map((b: any) => ({
      id: b.id,
      start_date: b.start_date,
      end_date: b.end_date,
      location_pickup: b.location_pickup,
      location_drop: b.location_drop,
      booking_status: b.booking_status,
      total_amount: Number(b.total_amount),
      created_at: b.created_at,
      vehicle_name: b.vehicles?.name || "Unknown Vehicle",
      vehicle_brand: b.vehicles?.brand || null,
      vehicle_images: b.vehicles?.images || null,
    }));

    const total = count ?? 0;
    return {
      bookings,
      total,
      totalPages: Math.ceil(total / ADMIN_PAGE_SIZE),
    };
  },
  [ADMIN_CACHE_TAGS.USER_BOOKINGS],
  { tags: [ADMIN_CACHE_TAGS.USER_BOOKINGS], revalidate: CACHE_TIME.FREQUENT },
);
