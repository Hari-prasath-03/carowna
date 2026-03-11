"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import GenericTable from "@/components/layout/generic-table";

const STATUS_MAP = {
  COMPLETED:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10",
  REQUESTED:
    "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/10",
  PENDING_PAYMENT:
    "bg-sky-500/10 text-sky-600 border-sky-500/20 hover:bg-sky-500/10",
  CANCELLED:
    "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10",
};

export type Booking = {
  id: string;
  created_at: string;
  booking_status: keyof typeof STATUS_MAP;
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
          header: "Booking ID",
          render: (b) => (
            <span className="text-xs font-semibold tracking-tighter text-muted-foreground group-hover:text-foreground transition-colors">
              #{b.id.slice(0, 8).toUpperCase()}
            </span>
          ),
        },
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
                "text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md",
                STATUS_MAP[b.booking_status],
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
