import { getBookingDetails } from "@/service/bookings";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  CreditCard,
  ArrowLeft,
  Tag,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

export default async function PaymentSuccessPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const [booking, err] = await getBookingDetails(bookingId);

  if (err || !booking) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <SuccessPageHeader />
      <main className="pt-20 px-5 max-w-lg mx-auto space-y-8">
        <SuccessStatusHeader bookingId={booking.id} />
        <VehicleDetailsCard vehicle={booking.vehicle} booking={booking} />
        {booking.driver && <DriverDetailsCard driver={booking.driver} />}
        <PaymentSummaryCard
          payment={booking.payment?.[0]}
          totalAmount={booking.total_amount}
          paidAmount={booking.initial_amount}
        />
        <NavigationActions />
      </main>
    </div>
  );
}

interface SuccessVehicle {
  name: string;
  images?: string[];
  vehicle_type: string;
}

interface SuccessBooking {
  start_date: string;
  end_date: string;
  location_pickup: string;
}

interface SuccessDriver {
  name: string;
  years_of_exp: number;
}

interface SuccessPayment {
  razorpay_payment_id?: string;
}

function SuccessPageHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b border-border px-4 h-16 flex items-center justify-between">
      <Link
        href="/history"
        className="p-2 hover:bg-muted rounded-full transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <h1 className="text-sm font-black uppercase tracking-widest">
        Payment Summary
      </h1>
      <div className="w-9" />
    </header>
  );
}

function SuccessStatusHeader({ bookingId }: { bookingId: string }) {
  return (
    <div className="text-center space-y-3 py-4">
      <div className="flex justify-center">
        <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
      </div>
      <h2 className="text-2xl font-black uppercase tracking-tight">
        Payment Successful!
      </h2>
      <p className="text-muted-foreground text-sm font-medium">
        Your booking #{bookingId.slice(0, 8).toUpperCase()} has been confirmed.
      </p>
    </div>
  );
}

function VehicleDetailsCard({
  vehicle,
  booking,
}: {
  vehicle: SuccessVehicle;
  booking: SuccessBooking;
}) {
  return (
    <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="relative aspect-video">
        {vehicle.images?.[0] ? (
          <Image
            src={vehicle.images[0]}
            alt={vehicle.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Tag className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest border border-border shadow-sm">
            {vehicle.vehicle_type}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-black uppercase tracking-tight mb-4">
          {vehicle.name}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold">
                Rental Period
              </p>
              <p className="text-foreground">
                {format(new Date(booking.start_date), "dd MMM")} -{" "}
                {format(new Date(booking.end_date), "dd MMM yyyy")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold">
                Location
              </p>
              <p className="text-foreground">{booking.location_pickup}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DriverDetailsCard({ driver }: { driver: SuccessDriver }) {
  return (
    <div className="bg-card border border-border rounded-[2.5rem] p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center shrink-0">
          <User className="h-5 w-5 text-foreground" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            Assigned Driver
          </p>
          <h4 className="text-sm font-black uppercase tracking-tight">
            {driver.name}
          </h4>
        </div>
      </div>
      <div className="pt-3 border-t border-border/50 flex justify-between items-center text-xs">
        <span className="text-muted-foreground font-medium">Experience</span>
        <span className="font-bold">{driver.years_of_exp} Years</span>
      </div>
    </div>
  );
}

function PaymentSummaryCard({
  payment,
  totalAmount,
  paidAmount,
}: {
  payment: SuccessPayment;
  totalAmount: number;
  paidAmount: number;
}) {
  return (
    <div className="bg-card border border-border rounded-[2.5rem] p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <CreditCard className="h-5 w-5 text-muted-foreground" />
        <h4 className="text-sm font-bold uppercase tracking-widest">
          Transaction Details
        </h4>
      </div>

      <div className="pt-2 space-y-3 border-t border-border/50">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground font-medium">
            Total Amount
          </span>
          <span className="font-bold">₹{totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground font-medium">
            Initial Deposit Paid
          </span>
          <span className="text-emerald-500 font-bold">
            ₹{paidAmount.toLocaleString()}
          </span>
        </div>
        {payment?.razorpay_payment_id && (
          <div className="flex justify-between items-center text-sm pt-2 border-t border-border/50">
            <span className="text-muted-foreground font-medium">
              Transaction ID
            </span>
            <span className="font-mono text-[10px] text-muted-foreground select-all">
              {payment.razorpay_payment_id}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function NavigationActions() {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/history"
        className="w-full py-4 rounded-2xl bg-primary text-primary-foreground text-center text-sm font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
      >
        Manage Bookings
      </Link>
      <Link
        href="/"
        className="w-full py-4 rounded-2xl bg-muted text-foreground outline outline-border text-center text-sm font-bold uppercase tracking-widest active:scale-95 transition-all"
      >
        Back to Home
      </Link>
    </div>
  );
}
