import { unstable_cache } from "next/cache";
import createAdminClient from "@/lib/supabase/clients/admin";
import { VENDOR_CACHE_TAGS, CACHE_TIME } from "@/constants/cache-tags";
import {
  VendorBooking,
  VendorBookingStats,
  VendorBookingDetails,
} from "@/types";
import { ADMIN_PAGE_SIZE } from "@/constants";
import QueryBuilder from "@/lib/query-builder";

export const getVendorBookingStats = (vendorId: string) =>
  unstable_cache(
    async (): Promise<VendorBookingStats> => {
      const sb = createAdminClient();

      const { data: vehicles } = await sb
        .from("vehicles")
        .select("id")
        .eq("vendor_id", vendorId);

      const vehicleIds = vehicles?.map((v) => v.id) || [];

      if (vehicleIds.length === 0) {
        return {
          totalBookings: 0,
          activeTrips: 0,
          pendingRequests: 0,
          totalRevenue: 0,
        };
      }

      const { data: bookings } = await sb
        .from("bookings")
        .select("booking_status, total_amount, payments(status, amount)")
        .in("vehicle_id", vehicleIds);

      const totalBookings = bookings?.length || 0;
      const activeTrips =
        bookings?.filter((b) => b.booking_status === "REQUESTED").length || 0;
      const pendingRequests =
        bookings?.filter((b) => b.booking_status === "PENDING_PAYMENT")
          .length || 0;

      const totalRevenue =
        bookings?.reduce((acc, b) => {
          const payments = b.payments as unknown as {
            status: string;
            amount: number;
          }[];
          const successfulPayments = payments?.filter(
            (p) => p.status === "SUCCESS",
          );
          const paymentTotal = successfulPayments?.reduce(
            (sum, p) => sum + Number(p.amount),
            0,
          );
          return acc + (paymentTotal || 0);
        }, 0) || 0;

      return {
        totalBookings,
        activeTrips,
        pendingRequests,
        totalRevenue,
      };
    },
    [VENDOR_CACHE_TAGS.BOOKING_STATS, vendorId],
    {
      tags: [VENDOR_CACHE_TAGS.BOOKING_STATS],
      revalidate: CACHE_TIME.FREQUENT,
    },
  )();

export const getVendorBookings = (
  vendorId: string,
  page: number = 1,
  filters?: {
    status?: string;
    search?: string;
  },
) =>
  unstable_cache(
    async (): Promise<{ bookings: VendorBooking[]; total: number }> => {
      const sb = createAdminClient();

      const { data: vehicles } = await sb
        .from("vehicles")
        .select("id")
        .eq("vendor_id", vendorId);

      const vehicleIds = vehicles?.map((v) => v.id) || [];

      if (vehicleIds.length === 0) return { bookings: [], total: 0 };

      const query = new QueryBuilder(
        sb.from("bookings").select(
          `
          id,
          start_date,
          end_date,
          booking_status,
          total_amount,
          initial_amount,
          created_at,
          user:users(name),
          vehicle:vehicles(name, registration_number),
          driver:drivers(name),
          payments(id, amount, status, payment_method, created_at)
        `,
          { count: "exact" },
        ),
      )
        .filter(true, "vehicle_id", vehicleIds, "in")
        .paginate(page, ADMIN_PAGE_SIZE)
        .sort("created_at", false);

      if (filters?.status && filters.status !== "all") {
        query.filter(true, "booking_status", filters.status.toUpperCase());
      }

      const { data, count, error } = await query.build();
      if (error) throw error;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bookings: VendorBooking[] = data.map((b: any) => {
        const lastPayment = b.payments?.[b.payments.length - 1];

        return {
          id: b.id,
          user_name: b.user?.name || "Unknown",
          vehicle_name: b.vehicle?.name || "N/A",
          driver_name: b.driver?.name || null,
          registration_number: b.vehicle?.registration_number || "N/A",
          start_date: b.start_date,
          end_date: b.end_date,
          total_amount: Number(b.total_amount),
          initial_amount: Number(b.initial_amount),
          booking_status: b.booking_status,
          payment_status: lastPayment?.status || "PENDING",
          payment_method: lastPayment?.payment_method || null,
          created_at: b.created_at,
        };
      });

      return {
        bookings,
        total: count || 0,
      };
    },
    [
      VENDOR_CACHE_TAGS.BOOKINGS_LIST,
      vendorId,
      page.toString(),
      JSON.stringify(filters),
    ],
    {
      tags: [VENDOR_CACHE_TAGS.BOOKINGS_LIST],
      revalidate: CACHE_TIME.FREQUENT,
    },
  )();

export const getVendorBookingDetails = (bookingId: string) =>
  unstable_cache(
    async (): Promise<VendorBookingDetails | null> => {
      const sb = createAdminClient();

      const { data, error } = await sb
        .from("bookings")
        .select(
          `
        id,
        start_date,
        end_date,
        booking_status,
        total_amount,
        initial_amount,
        created_at,
        user:users(name, email, mobile_no),
        vehicle:vehicles(name, registration_number, brand, images),
        driver:drivers(name, license_doc_url),
        payments(id, amount, status, payment_method, created_at)
      `,
        )
        .eq("id", bookingId)
        .single();

      if (error) {
        console.error("Booking Details Fetch Error:", error);
        return null;
      }
      if (!data) return null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const b = data as any;
      const lastPayment = b.payments?.[b.payments?.length - 1];

      return {
        id: b.id,
        user_name: b.user?.name || "Unknown",
        user_email: b.user?.email || "N/A",
        user_phone: b.user?.mobile_no || null,
        vehicle_name: b.vehicle?.name || "N/A",
        vehicle_brand: b.vehicle?.brand || null,
        vehicle_images: b.vehicle?.images || [],
        driver_name: b.driver?.name || null,
        driver_license: b.driver?.license_doc_url || null,
        registration_number: b.vehicle?.registration_number || "N/A",
        start_date: b.start_date,
        end_date: b.end_date,
        total_amount: Number(b.total_amount),
        initial_amount: Number(b.initial_amount),
        booking_status: b.booking_status,
        payment_status: lastPayment?.status || "PENDING",
        payment_method: lastPayment?.payment_method || null,
        created_at: b.created_at,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payments: (b.payments || []).map((p: any) => ({
          ...p,
          amount: Number(p.amount),
        })),
      };
    },
    [VENDOR_CACHE_TAGS.BOOKING_DETAILS, bookingId],
    {
      tags: [VENDOR_CACHE_TAGS.BOOKING_DETAILS],
      revalidate: CACHE_TIME.FREQUENT,
    },
  )();
