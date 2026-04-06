"use client";

import { VendorBookingDetails } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BOOKING_STATUS_STYLES } from "@/constants/shared-styles";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import BackButton from "@/components/layout/back-button";
import PathTillNow from "@/components/admin/shared/path-till-now";

interface Props {
  booking: VendorBookingDetails;
}

export default function BookingHeader({ booking }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <BackButton />
        <PathTillNow
          replace={{
            this: booking.id,
            with: booking.vehicle_name,
          }}
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tighter uppercase whitespace-nowrap">
              Booking on {booking.vehicle_name}
            </h1>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md",
                BOOKING_STATUS_STYLES[booking.booking_status],
              )}
            >
              {booking.booking_status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-3.5 opacity-50" />
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">
              Reserved on{" "}
              {format(new Date(booking.created_at), "MMMM dd, yyyy")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
