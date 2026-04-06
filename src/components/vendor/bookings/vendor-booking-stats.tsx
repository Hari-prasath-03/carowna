"use client";

import { VendorBookingStats } from "@/types";
import { Calendar, CheckCircle, Clock, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

interface VendorBookingStatsProps {
  stats: VendorBookingStats;
}

export default function VendorBookingStatsView({
  stats,
}: VendorBookingStatsProps) {
  const cards = [
    {
      title: "TOTAL BOOKINGS",
      value: stats.totalBookings,
      icon: Calendar,
      iconColor: "text-primary",
    },
    {
      title: "ACTIVE TRIPS",
      value: stats.activeTrips,
      icon: CheckCircle,
      iconColor: "text-emerald-500",
    },
    {
      title: "PENDING REQUESTS",
      value: stats.pendingRequests,
      icon: Clock,
      iconColor: "text-amber-500",
    },
    {
      title: "TOTAL REVENUE",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      iconColor: "text-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-card rounded-xl border border-border/40 p-6 flex flex-col justify-between shadow-sm min-h-35 hover:border-border/60 transition-all"
          >
            <div className="flex items-start justify-between">
              <Icon className={cn("size-5 mt-1", card.iconColor)} />
            </div>

            <div className="mt-4 space-y-1">
              <p className="text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase opacity-70">
                {card.title}
              </p>
              <h3 className="text-2xl font-black tracking-tighter text-foreground">
                {card.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
