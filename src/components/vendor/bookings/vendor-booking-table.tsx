"use client";

import { VendorBooking } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import GenericTable from "@/components/layout/generic-table";
import { BOOKING_STATUS_STYLES } from "@/constants/shared-styles";
import { Calendar, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import FormSelect from "@/components/forms/form-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";

interface VendorBookingTableProps {
  bookings: VendorBooking[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export default function VendorBookingTable({
  bookings,
  total,
  currentPage,
  totalPages,
}: VendorBookingTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      params.set("page", "1");
      return params.toString();
    },
    [searchParams],
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + "?" + createQueryString(name, value));
  };

  const status = searchParams.get("status") || "all";
  const search = searchParams.get("search") || "";

  return (
    <GenericTable
      header={{
        title: "Booking Ledger",
        subtitle: `${total} TOTAL RESERVATIONS LOGGED`,
        renderRightSection: () => (
          <div className="flex items-center gap-3">
            <FormSelect
              label=""
              name="status"
              defaultValue={status}
              onValueChange={(v) => handleFilterChange("status", v)}
              containerClassName="w-[180px] gap-0 text-[10px]"
              options={[
                { label: "ALL STATUSES", value: "all" },
                { label: "REQUESTS", value: "requested" },
                { label: "COMPLETED", value: "completed" },
                { label: "CANCELLED", value: "cancelled" },
                { label: "AWAITING PAYMENT", value: "pending_payment" },
              ]}
            />
            <div className="relative group w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <Input
                defaultValue={search}
                placeholder="Search rentals..."
                className="pl-9 h-11 border-border/40 bg-muted/20 focus:bg-background transition-all rounded-xl text-xs font-bold"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFilterChange(
                      "search",
                      e.currentTarget.value || "all",
                    );
                  }
                }}
              />
            </div>
            {(status !== "all" || search !== "") && (
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 shrink-0"
                onClick={() => router.push(pathname)}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        ),
      }}
      data={bookings}
      getRowKey={(item) => item.id}
      pagination={{
        currentPage,
        totalPages,
        total,
        label: "bookings",
        extraParams: Object.fromEntries(searchParams.entries()),
      }}
      columns={[
        {
          header: "VEHICLE",
          render: (item) => (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground uppercase tracking-tight">
                {item.vehicle_name}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                {item.user_name}
              </span>
            </div>
          ),
        },
        {
          header: "BOOKED AT",
          render: (item) => (
            <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap capitalize">
              {format(new Date(item.created_at), "MMM d, yyyy")}
            </span>
          ),
        },
        {
          header: "DRIVER",
          render: (item) => (
            <span
              className={cn(
                "text-xs font-bold whitespace-nowrap uppercase tracking-tight",
                item.driver_name
                  ? "text-foreground"
                  : "text-muted-foreground/40",
              )}
            >
              {item.driver_name || "Self Drive"}
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
                "text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md",
                BOOKING_STATUS_STYLES[item.booking_status],
              )}
            >
              {item.booking_status}
            </Badge>
          ),
        },
        {
          header: "TOTAL",
          render: (item) => (
            <span className="text-sm font-black text-foreground">
              ₹{item.total_amount.toLocaleString()}
            </span>
          ),
        },
        {
          header: "ACTION",
          className: "text-right",
          headerClassName: "text-right",
          render: (item) => (
            <div className="flex justify-end">
              <Link href={`/vendor/bookings/${item.id}`} title="View details">
                <Button size="xs" variant="outline">
                  View Details
                </Button>
              </Link>
            </div>
          ),
        },
      ]}
    />
  );
}
