import { redirect } from "next/navigation";
import { getUser } from "@/service/self-user";
import VendorBookingStatsView from "@/components/vendor/bookings/vendor-booking-stats";
import VendorBookingTable from "@/components/vendor/bookings/vendor-booking-table";
import Header from "@/components/admin/shared/header";
import { ADMIN_PAGE_SIZE } from "@/constants";
import {
  getVendorBookings,
  getVendorBookingStats,
} from "@/service/vendor/bookings";

interface Props {
  searchParams: Promise<{
    page?: string;
    status?: string;
    search?: string;
  }>;
}

export default async function VendorBookingsPage({ searchParams }: Props) {
  const [user, userErr] = await getUser();
  if (!user || userErr) redirect("/login");

  const sParams = await searchParams;
  const page = parseInt(sParams.page || "1");
  const filters = {
    status: sParams.status,
    search: sParams.search,
  };

  const [stats, { bookings, total }] = await Promise.all([
    getVendorBookingStats(user.id),
    getVendorBookings(user.id, page, filters),
  ]);

  return (
    <div className="space-y-8 pb-8">
      <Header
        title="Fleet Bookings"
        disc="Track your rental history, manage active trips, and monitor payment settlements."
      />

      <VendorBookingStatsView stats={stats} />
      <VendorBookingTable
        bookings={bookings}
        total={total}
        currentPage={page}
        totalPages={Math.ceil(total / ADMIN_PAGE_SIZE)}
      />
    </div>
  );
}
