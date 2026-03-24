import { notFound } from "next/navigation";
import { getAdminBookingDetails } from "@/service/admin/bookings";
import BookingDetailsHeader from "@/components/admin/booking/booking-details-header";
import BookingTripInfo from "@/components/admin/booking/booking-trip-info";
import BookingFinancialInfo from "@/components/admin/booking/booking-financial-info";
import BookingLinkedAssets from "@/components/admin/booking/booking-linked-assets";

interface BookingDetailsPageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function BookingDetailsPage({
  params,
}: BookingDetailsPageProps) {
  const { bookingId } = await params;

  const booking = await getAdminBookingDetails(bookingId);

  if (!booking) notFound();

  return (
    <div className="space-y-8 pb-8">
      <BookingDetailsHeader bookingId={booking.id} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <BookingTripInfo
            startDate={booking.start_date}
            endDate={booking.end_date}
            locationPickup={booking.location_pickup}
            locationDrop={booking.location_drop}
            status={booking.booking_status}
          />

          <BookingFinancialInfo
            initialAmount={booking.initial_amount}
            totalAmount={booking.total_amount}
          />
        </div>

        <div className="lg:col-span-1 h-full">
          <BookingLinkedAssets
            userId={booking.user.id}
            vehicleId={booking.vehicle_id}
            driverId={booking.driver_id}
            customerProfileUrl={booking.user.profile_url}
          />
        </div>
      </div>
    </div>
  );
}
