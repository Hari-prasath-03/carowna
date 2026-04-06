"use client";

import { VendorRecentBooking } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import GenericTable from "@/components/layout/generic-table";
import {
  BOOKING_STATUS_STYLES,
  BOOKING_STATUS_BADGE_STYLES,
} from "@/constants/shared-styles";
import Link from "next/link";
import { Calendar } from "lucide-react";

interface RecentBookingsProps {
  bookings: VendorRecentBooking[];
}

export default function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <GenericTable
      header={{
        title: "Recent Bookings",
        renderRightSection: () => (
          <Link
            href="/vendor/bookings"
            className="text-xs font-bold text-primary hover:underline transition-all"
          >
            View All Bookings
          </Link>
        ),
      }}
      data={bookings}
      getRowKey={(item) => item.id}
      columns={[
        {
          header: "VEHICLE",
          render: (item) => (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">
                {item.vehicle_name}
              </span>
              {item.vehicle_brand && (
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                  {item.vehicle_brand}
                </span>
              )}
            </div>
          ),
        },
        {
          header: "BOOKED AT",
          render: (item) => (
            <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
              {format(new Date(item.created_at), "MMM d, yyyy")}
            </span>
          ),
        },
        {
          header: "DATES",
          render: (item) => (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-3 opacity-50" />
              <span className="text-xs font-bold whitespace-nowrap">
                {format(new Date(item.start_date), "MMM d")} -{" "}
                {format(new Date(item.end_date), "MMM d, yyyy")}
              </span>
            </div>
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
        {
          header: "TOTAL",
          className: "text-right",
          headerClassName: "text-right",
          render: (item) => (
            <span className="text-sm font-black text-foreground">
              ₹{item.total_amount.toLocaleString()}
            </span>
          ),
        },
      ]}
    />
  );
}
