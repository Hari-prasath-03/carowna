import {
  getAdminBookings,
  getAdminBookingStats,
} from "@/service/admin/bookings";
import Header from "@/components/admin/shared/header";
import BookingStats from "@/components/admin/booking/booking-stats";
import BookingTable from "@/components/admin/booking/booking-table";
import { ADMIN_PAGE_SIZE } from "@/constants";

interface BookingsPageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function BookingsManagementPage({
  searchParams,
}: BookingsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const status = (params.status ?? "all").toLowerCase();

  const [stats, { bookings, total, totalPages }] = await Promise.all([
    getAdminBookingStats(),
    getAdminBookings(page, ADMIN_PAGE_SIZE, status.toUpperCase()),
  ]);

  return (
    <div className="space-y-8">
      <Header
        title="Booking Management"
        disc="Review and manage all vehicle reservations across the platform."
      />
      <BookingStats stats={stats} />
      <BookingTable
        bookings={bookings}
        currentPage={page}
        totalPages={totalPages}
        total={total}
        currentStatus={status}
      />
    </div>
  );
}
