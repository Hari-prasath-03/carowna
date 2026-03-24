"use client";

import Image from "next/image";
import { UserBookingHistoryItem } from "@/types";
import GenericTable from "@/components/layout/generic-table";
import { Car, Calendar as CalIcon, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  BOOKING_STATUS_BADGE_STYLES,
  BOOKING_STATUS_STYLES,
} from "@/constants/shared-styles";
import { cn } from "@/lib/utils";

interface UserBookingsTableProps {
  bookings: UserBookingHistoryItem[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export default function UserBookingsTable({
  bookings,
  currentPage,
  totalPages,
  total,
}: UserBookingsTableProps) {

  return (
    <GenericTable
      header={{
        title: "Booking History",
        subtitle: "Past and present vehicle rentals",
      }}
      data={bookings}
      getRowKey={(b) => b.id}
      columns={[
        {
          header: "Vehicle",
          render: (b) => (
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-10 rounded-lg overflow-hidden bg-muted border border-border/30 flex items-center justify-center shrink-0">
                {b.vehicle_images?.[0] ? (
                  <Image
                    src={b.vehicle_images[0]}
                    alt={b.vehicle_name}
                    width={48}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Car className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-foreground">
                  {b.vehicle_name}
                </p>
                {b.vehicle_brand && (
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-0.5">
                    {b.vehicle_brand}
                  </p>
                )}
              </div>
            </div>
          ),
        },
        {
          header: "Duration",
          render: (b) => (
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CalIcon className="w-4 h-4 text-muted-foreground" />
              <span>
                {format(new Date(b.start_date), "MMM d")} -{" "}
                {format(new Date(b.end_date), "MMM d, yyyy")}
              </span>
            </div>
          ),
        },
        {
          header: "Route",
          render: (b) => (
            <div className="flex flex-col gap-2 text-xs font-medium text-muted-foreground max-w-37.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate" title={b.location_pickup || "N/A"}>
                  {b.location_pickup || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                <span className="truncate" title={b.location_drop || "N/A"}>
                  {b.location_drop || "N/A"}
                </span>
              </div>
            </div>
          ),
        },
        {
          header: "Status",
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
        {
          header: "Amount",
          headerClassName: "text-right",
          className: "text-right font-black tracking-tight",
          render: (b) => <span>₹{b.total_amount.toLocaleString("en-IN")}</span>,
        },
      ]}
      pagination={{
        currentPage,
        totalPages,
        total,
        label: "bookings",
      }}
    />
  );
}
