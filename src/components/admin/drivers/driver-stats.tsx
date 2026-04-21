"use client";

import { SystemDriverStats } from "@/types";
import { Users, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DriverStatsProps {
  stats: SystemDriverStats;
}

export default function DriverStatsView({ stats }: DriverStatsProps) {
  const cards = [
    {
      title: "TOTAL DRIVERS",
      value: stats.totalDrivers,
      icon: Users,
      iconColor: "text-primary",
    },
    {
      title: "ONLINE DRIVERS",
      value: stats.onlineDrivers,
      icon: CheckCircle,
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
