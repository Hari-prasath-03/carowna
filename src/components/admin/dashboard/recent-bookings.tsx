"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import GenericTable from "@/components/layout/generic-table";

import {
  BOOKING_STATUS_BADGE_STYLES,
  BOOKING_STATUS_STYLES,
} from "@/constants/shared-styles";

export type Booking = {
  id: string;
  created_at: string;
  booking_status: string;
  total_amount: number;
  user?: {
    name: string;
  };
  vehicle?: {
    name: string;
    brand: string;
  };
  vendor?: {
    name: string;
  };
};

export default function RecentBookingsTable({
  bookings,
}: {
  bookings: Booking[];
}) {
  return (
    <GenericTable
      header={{
        title: "Recent Bookings",
        subtitle: "Monitor platform-wide booking activity",
        renderRightSection: () => (
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors group"
          >
            View All{" "}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ),
      }}
      data={bookings}
      columns={[
        {
          header: "Customer",
          render: (b) => (
            <span className="text-sm font-bold text-foreground opacity-90">
              {b.user?.name || "Unknown User"}
            </span>
          ),
        },
        {
          header: "Vehicle",
          render: (b) => (
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                {b.vehicle?.name}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {b.vehicle?.brand}
              </span>
            </div>
          ),
        },
        {
          header: "Vendor",
          render: (b) => (
            <span className="text-sm font-bold text-muted-foreground/80">
              {b.vendor?.name || "Platform"}
            </span>
          ),
        },
        {
          header: "Amount",
          className: "text-right",
          headerClassName: "text-right",
          render: (b) => (
            <span className="text-sm font-semibold tracking-tighter text-foreground">
              ₹{b.total_amount}
            </span>
          ),
        },
        {
          header: "Status",
          className: "text-right",
          headerClassName: "text-right",
          render: (b) => (
            <Badge
              variant="outline"
              className={cn(
                BOOKING_STATUS_BADGE_STYLES,
                BOOKING_STATUS_STYLES[b.booking_status],
              )}
            >
              {b.booking_status}
            </Badge>
          ),
        },
      ]}
      getRowKey={(b) => b.id}
    />
  );
}
