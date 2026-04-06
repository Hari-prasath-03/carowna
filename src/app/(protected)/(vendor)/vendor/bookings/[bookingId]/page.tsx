import { getVendorBookingDetails } from "@/service/vendor/bookings";
import { getUser } from "@/service/self-user";
import { redirect, notFound } from "next/navigation";
import BookingHeader from "@/components/vendor/bookings/booking-header";
import RentalInfoCard from "@/components/vendor/bookings/rental-info-card";
import CustomerProfileCard from "@/components/vendor/bookings/customer-profile-card";
import PaymentSettlementCard from "@/components/vendor/bookings/payment-settlement-card";

interface Props {
  params: Promise<{
    bookingId: string;
  }>;
}

export default async function VendorBookingDetailsPage({ params }: Props) {
  const [user, userErr] = await getUser();
  if (!user || userErr) redirect("/login");

  const { bookingId } = await params;
  const booking = await getVendorBookingDetails(bookingId);

  if (!booking) notFound();

  return (
    <div className="space-y-12 pb-20">
      <BookingHeader booking={booking} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <RentalInfoCard booking={booking} />
        <CustomerProfileCard booking={booking} />
      </div>

      <PaymentSettlementCard booking={booking} />
    </div>
  );
}
