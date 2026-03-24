"use client";

import { AdminBookingStats } from "@/types";
import { CalendarCheck, Car, ClipboardList, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingStatsProps {
  stats: AdminBookingStats;
}

export default function BookingStats({ stats }: BookingStatsProps) {
  const cards = [
    {
      title: "TOTAL BOOKINGS",
      value: stats.totalBookings,
      icon: CalendarCheck,
      iconColor: "text-primary",
    },
    {
      title: "ACTIVE TRIPS",
      value: stats.activeTrips,
      icon: Car,
      iconColor: "text-amber-500",
    },
    {
      title: "PENDING CONFIRMATIONS",
      value: stats.pendingConfirmations,
      icon: ClipboardList,
      iconColor: "text-warning",
    },
    {
      title: "CANCELLED",
      value: stats.cancelled,
      icon: XCircle,
      iconColor: "text-destructive",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-card rounded-xl border border-border/40 p-6 flex flex-col justify-between shadow-sm min-h-35"
          >
            <div className="flex items-start justify-between">
              <Icon className={cn("size-5 mt-1.5", card.iconColor)} />
            </div>

            <div className="mt-4 space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                {card.title}
              </p>
              <h3 className="text-3xl font-black tracking-tighter text-foreground">
                {card.value.toLocaleString()}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
