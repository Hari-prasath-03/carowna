"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminBookingListItem } from "@/types";
import GenericTable from "@/components/layout/generic-table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import FormSelect from "@/components/forms/form-select";
import {
  BOOKING_STATUS_STYLES,
  BOOKING_STATUS_BADGE_STYLES,
} from "@/constants/shared-styles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BookingTableProps {
  bookings: AdminBookingListItem[];
  currentPage: number;
  totalPages: number;
  total: number;
  currentStatus: string;
}

export default function BookingTable({
  bookings,
  currentPage,
  totalPages,
  total,
  currentStatus,
}: BookingTableProps) {
  const pathname = usePathname();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams();
    if (name === "page") params.set(name, value);
    else params.set("page", "1");

    if (name !== "status" && currentStatus !== "all")
      params.set("status", currentStatus);
    if (name === "status" && value !== "all") params.set("status", value);

    return params.toString();
  };

  const handleStatusChange = (value: string) => {
    const qs = createQueryString("status", value);
    window.history.pushState(null, "", `${pathname}?${qs}`);
    window.location.href = `${pathname}?${qs}`;
  };

  const calculateDays = (start: string, end: string) => {
    const diffTime = Math.abs(
      new Date(end).getTime() - new Date(start).getTime(),
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <GenericTable
      header={{
        title: "All Bookings",
        subtitle: "Manage and track reservations",
        renderRightSection: () => (
          <div className="w-40">
            <FormSelect
              label=""
              name="status"
              defaultValue={currentStatus}
              onValueChange={handleStatusChange}
              options={[
                { label: "Status: All", value: "all" },
                { label: "Ongoing", value: "ongoing" },
                { label: "Confirmed", value: "confirmed" },
                { label: "Requested", value: "requested" },
                { label: "Completed", value: "completed" },
                { label: "Cancelled", value: "cancelled" },
              ]}
              containerClassName="gap-0 font-semibold"
            />
          </div>
        ),
      }}
      data={bookings}
      getRowKey={(v) => v.id}
      columns={[
        {
          header: "Customer",
          render: (booking) => (
            <span className="text-sm font-bold text-foreground opacity-90 truncate max-w-25 inline-block">
              {booking.user_name}
            </span>
          ),
        },
        {
          header: "Vehicle",
          render: (b) => (
            <div className="flex flex-col gap-0.5 max-w-30">
              <span className="text-sm font-semibold tracking-tight text-foreground truncate">
                {b.vehicle?.name}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                {b.vehicle?.brand}
              </span>
            </div>
          ),
        },
        {
          header: "Vendor",
          render: (b) => (
            <span className="text-sm font-bold text-muted-foreground/80 truncate max-w-30 inline-block">
              {b.vendor_name}
            </span>
          ),
        },
        {
          header: "Trip Dates",
          render: (b) => (
            <div className="text-sm font-medium text-foreground">
              <span>
                {format(new Date(b.start_date), "MMM d")} -{" "}
                {format(new Date(b.end_date), "MMM d, yyyy")}
              </span>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                {calculateDays(b.start_date, b.end_date)} DAYS
              </p>
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
          header: "Action",
          headerClassName: "text-right",
          className: "text-right",
          render: (b) => (
            <Link href={`/dashboard/bookings/${b.id}`}>
              <Button
                size="sm"
                className="rounded-xl font-semibold text-xs px-5 py-2 h-auto shadow-sm"
              >
                View Details
              </Button>
            </Link>
          ),
        },
      ]}
      pagination={{
        currentPage,
        totalPages,
        total,
        label: "bookings",
        extraParams: { status: currentStatus },
      }}
    />
  );
}
