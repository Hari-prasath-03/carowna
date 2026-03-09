"use client";

import { useState, useTransition } from "react";
import {
  Calendar,
  FileText,
  RotateCcw,
  Bike,
  Car,
  Trophy,
  XCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { format, isAfter, isBefore, isWithinInterval } from "date-fns";
import cancelBookingAction from "@/actions/booking/cancel-booking";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export type BookingStatus = "Active" | "Upcoming" | "Completed" | "Cancelled";

export interface HistoryVehicle {
  name: string;
  images?: string[];
  vehicle_type: string;
}

export interface HistoryBooking {
  id: string;
  start_date: string;
  end_date: string;
  booking_status: string;
  total_amount: number;
  vehicle: HistoryVehicle;
}

export default function HistoryClient({
  initialBookings,
}: {
  initialBookings: HistoryBooking[];
}) {
  const [activeTab, setActiveTab] = useState<BookingStatus>("Active");
  const now = new Date();

  // Client-side filtering
  const filteredBookings = initialBookings.filter((b) => {
    const start = new Date(b.start_date);
    const end = new Date(b.end_date);

    if (activeTab === "Cancelled") return b.booking_status === "CANCELLED";
    if (activeTab === "Completed")
      return (
        b.booking_status === "COMPLETED" ||
        (b.booking_status === "REQUESTED" && isBefore(end, now))
      );
    if (activeTab === "Upcoming")
      return b.booking_status === "REQUESTED" && isAfter(start, now);
    if (activeTab === "Active")
      return (
        b.booking_status === "REQUESTED" &&
        isWithinInterval(now, { start, end })
      );
    return false;
  });

  return (
    <div className="max-w-lg mx-auto">
      <HistoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="px-5 pt-6">
        {filteredBookings.length === 0 ? (
          <HistoryEmptyState />
        ) : (
          <BookingList bookings={filteredBookings} />
        )}
      </div>
    </div>
  );
}

function HistoryTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: BookingStatus;
  onTabChange: (tab: BookingStatus) => void;
}) {
  const tabs: BookingStatus[] = [
    "Active",
    "Upcoming",
    "Completed",
    "Cancelled",
  ];

  return (
    <div className="sticky top-16 bg-background z-40 border-b border-border">
      <div className="flex overflow-x-auto no-scrollbar px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-none px-4 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(var(--primary),0.3)]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function BookingList({ bookings }: { bookings: HistoryBooking[] }) {
  return (
    <div className="space-y-6 pb-10">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}

function BookingCard({ booking }: { booking: HistoryBooking }) {
  const vehicle = booking.vehicle;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const now = new Date();
  const end = new Date(booking.end_date);

  // Logic to determine if booking is "initial" (can be cancelled)
  const isCancellable =
    booking.booking_status === "REQUESTED" && isAfter(end, now);
  const isCompleted =
    booking.booking_status === "COMPLETED" ||
    (booking.booking_status === "REQUESTED" && isBefore(end, now));
  const isCancelled = booking.booking_status === "CANCELLED";

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    startTransition(async () => {
      const [, err] = await cancelBookingAction(booking.id);
      if (err) {
        toast.error(err.reason);
      } else {
        toast.success("Booking cancelled successfully");
        router.refresh();
      }
    });
  };

  return (
    <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm group hover:shadow-md transition-shadow duration-300">
      <div className="p-5 flex gap-5">
        <div className="relative h-24 w-24 rounded-3xl overflow-hidden bg-muted shrink-0 border border-border">
          {vehicle.images?.[0] ? (
            <Image
              src={vehicle.images[0]}
              alt={vehicle.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground/30">
              {vehicle.vehicle_type === "bike" ? (
                <Bike className="h-8 w-8" />
              ) : (
                <Car className="h-8 w-8" />
              )}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-sm font-black uppercase tracking-tight leading-tight">
                {vehicle.name}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-colors ${
                  isCompleted
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : isCancelled
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : "bg-primary/10 text-primary border-primary/20"
                }`}
              >
                {isCompleted ? "COMPLETED" : booking.booking_status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground mt-2">
              <Calendar className="h-3 w-3" />
              <span>
                {format(new Date(booking.start_date), "dd MMM")} -{" "}
                {format(new Date(booking.end_date), "dd MMM yyyy")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-1">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            Total Paid
          </span>
          <span className="text-sm font-black tracking-tight">
            ₹{booking.total_amount.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <Link
            href={`/payment/${booking.id}`}
            className="flex items-center justify-center gap-2 py-3 bg-background border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-colors"
          >
            <FileText className="h-3 w-3" />
            Invoice
          </Link>

          {isCancellable ? (
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="flex items-center justify-center gap-2 py-3 bg-destructive text-destructive-foreground rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              Cancel
            </button>
          ) : (
            <button className="flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
              <RotateCcw className="h-3 w-3" />
              Book Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function HistoryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative mb-8">
        <div className="h-40 w-40 bg-muted/50 rounded-full flex items-center justify-center border border-border shadow-inner">
          <Car className="h-16 w-16 text-muted-foreground/20" />
        </div>
        <div className="absolute -top-2 -right-2 h-12 w-12 bg-card border border-border rounded-2xl flex items-center justify-center shadow-lg -rotate-12 transition-transform hover:rotate-0 duration-500">
          <Bike className="h-6 w-6 text-foreground" />
        </div>
        <div className="absolute -bottom-2 -left-2 h-12 w-12 bg-card border border-border rounded-2xl flex items-center justify-center shadow-lg rotate-12 transition-transform hover:rotate-0 duration-500">
          <Trophy className="h-6 w-6 text-emerald-500" />
        </div>
      </div>

      <h3 className="text-2xl font-black uppercase tracking-tight mb-3">
        No Rentals Yet
      </h3>
      <p className="text-sm text-muted-foreground font-medium max-w-60 leading-relaxed mb-10">
        Looks like you haven&apos;t booked a vehicle. Start exploring now!
      </p>

      <Link
        href="/"
        className="w-full py-4 bg-primary text-primary-foreground rounded-3xl text-sm font-black uppercase tracking-widest shadow-[0_10px_40px_rgba(var(--primary),0.3)] active:scale-95 transition-all max-w-70"
      >
        Browse Vehicles
      </Link>
    </div>
  );
}
