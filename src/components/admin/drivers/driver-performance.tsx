"use client";

import { SystemDriverDetails } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import GenericTable from "@/components/layout/generic-table";
import {
  BOOKING_STATUS_STYLES,
  BOOKING_STATUS_BADGE_STYLES,
} from "@/constants/shared-styles";

interface Props {
  performance: SystemDriverDetails["performance"];
  bookings: SystemDriverDetails["recentBookings"];
}

export default function DriverPerformance({ performance, bookings }: Props) {
  const stats = [
    {
      label: "TOTAL REVENUE",
      value: `₹${performance.totalRevenue.toLocaleString()}`,
      color: "text-foreground",
    },
    {
      label: "UTILIZATION",
      value: `${performance.utilization.toFixed(1)}%`,
      color: "text-primary",
    },
  ];

  return (
    <div className="bg-card border border-border/40 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-8 border-b border-border/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h2 className="text-xl font-black tracking-tighter text-foreground uppercase">
          Driving Performance
        </h2>

        <div className="flex items-center gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-right space-y-0.5">
              <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase opacity-60">
                {stat.label}
              </p>
              <h3
                className={cn(
                  "text-2xl font-black tracking-tighter",
                  stat.color,
                )}
              >
                {stat.value}
              </h3>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        <GenericTable
          data={bookings}
          getRowKey={(item) => item.id}
          columns={[
            {
              header: "RENTER",
              render: (item) => (
                <span className="text-sm font-black text-foreground uppercase">
                  {item.user_name}
                </span>
              ),
            },
            {
              header: "DATE RANGE",
              render: (item) => (
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {format(new Date(item.start_date), "MMM d")} -{" "}
                  {format(new Date(item.end_date), "MMM d, yyyy")}
                </span>
              ),
            },
            {
              header: "TOTAL AMOUNT",
              render: (item) => (
                <span className="text-sm font-black text-foreground">
                  ₹{item.total_amount.toLocaleString()}
                </span>
              ),
            },
            {
              header: "STATUS",
              render: (item) => (
                <Badge
                  variant="outline"
                  className={cn(
                    BOOKING_STATUS_BADGE_STYLES,
                    BOOKING_STATUS_STYLES[item.booking_status] ||
                      "bg-muted/10 text-muted-foreground border-border/30",
                  )}
                >
                  {item.booking_status}
                </Badge>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
