"use client";

import { VendorDashboardStats } from "@/types";
import {
  Car,
  CalendarCheck,
  CalendarClock,
  UserCheck,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VendorStatsProps {
  stats: VendorDashboardStats;
}

export default function VendorStats({ stats }: VendorStatsProps) {
  const cards = [
    {
      title: "TOTAL VEHICLES",
      value: stats.totalVehicles,
      icon: Car,
      iconColor: "text-blue-500",
      description: "Total cars & bikes listed",
    },
    {
      title: "ACTIVE BOOKINGS",
      value: stats.activeBookings,
      icon: CalendarCheck,
      iconColor: "text-amber-500",
      description: "In progress bookings",
    },
    {
      title: "UPCOMING",
      value: stats.upcomingBookings,
      icon: CalendarClock,
      iconColor: "text-primary",
      description: "Bookings in next 7 days",
    },
    {
      title: "AVAILABLE DRIVERS",
      value: stats.availableDrivers,
      icon: UserCheck,
      iconColor: "text-emerald-500",
      description: "Approved & ready on standby",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-card rounded-2xl border border-border/40 p-6 flex flex-col justify-between shadow-sm min-h-40 group hover:border-border transition-all"
          >
            <div className="flex items-start justify-between">
              <div className={cn("p-2 rounded-lg bg-muted/40", card.iconColor)}>
                <Icon className="size-5" />
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <h3 className="text-3xl font-black tracking-tighter text-foreground">
                {card.value.toLocaleString()}
              </h3>
              <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase opacity-70">
                {card.title}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground/60 transition-opacity">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}

      <div className="bg-foreground rounded-2xl p-6 flex flex-col justify-between shadow-lg min-h-40 group hover:scale-[1.01] transition-all">
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-lg bg-background/10 text-background">
            <Wallet className="size-5" />
          </div>
        </div>

        <div className="mt-4 space-y-1 text-background">
          <h3 className="text-3xl font-black tracking-tighter">
            ₹{stats.totalEarnings.toLocaleString()}
          </h3>
          <p className="text-[10px] font-black tracking-widest uppercase opacity-60">
            TOTAL EARNINGS
          </p>
          <p className="text-[10px] font-bold opacity-40">
            Net revenue this quarter
          </p>
        </div>
      </div>
    </div>
  );
}
