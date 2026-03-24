"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { VendorVehicle } from "@/types";
import GenericTable from "@/components/layout/generic-table";
import { Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  VEHICLE_TYPE_STYLES_ALT,
  APPROVAL_STATUS_STYLES,
  VEHICLE_AVAILABILITY_STYLES,
} from "@/constants/shared-styles";

interface VendorVehiclesTableProps {
  vehicles: VendorVehicle[];
  currentPage: number;
  totalPages: number;
  total: number;
}

import { differenceInCalendarDays } from "date-fns";

export function formatLastRented(date: string | null) {
  if (!date) return "Never rented";

  const [y, m, d] = date.split("-").map(Number);
  const rentedDate = new Date(y, m - 1, d);
  const days = differenceInCalendarDays(new Date(), rentedDate);

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 0) return "Upcoming";

  return `${days} days ago`;
}

export default function VendorVehiclesTable({
  vehicles,
  currentPage,
  totalPages,
  total,
}: VendorVehiclesTableProps) {
  return (
    <GenericTable
      header={{
        title: "Vehicle Listings",
        subtitle: `${total} vehicle${total !== 1 ? "s" : ""} in fleet`,
      }}
      data={vehicles}
      getRowKey={(v) => v.id}
      columns={[
        {
          header: "Vehicle",
          render: (v) => (
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border/30 flex items-center justify-center shrink-0">
                {v.images && v.images.length > 0 ? (
                  <Image
                    src={v.images[0]}
                    alt={v.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Car className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-foreground">
                  {v.name}
                </p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">
                  {v.registration_number}
                </p>
              </div>
            </div>
          ),
        },
        {
          header: "Category",
          render: (v) => (
            <Badge
              variant="outline"
              className={cn(
                "uppercase tracking-widest text-[10px] font-bold",
                VEHICLE_TYPE_STYLES_ALT[v.vehicle_type],
              )}
            >
              {v.vehicle_type}
            </Badge>
          ),
        },

        {
          header: "Status",
          render: (v) => (
            <Badge
              variant="outline"
              className={cn(
                "font-semibold",
                APPROVAL_STATUS_STYLES[v.approval_status] ??
                  APPROVAL_STATUS_STYLES.PENDING,
              )}
            >
              {v.approval_status}
            </Badge>
          ),
        },
        {
          header: "Availability",
          render: (v) => (
            <Badge
              variant="outline"
              className={cn(
                "font-semibold",
                v.is_available
                  ? VEHICLE_AVAILABILITY_STYLES.available
                  : VEHICLE_AVAILABILITY_STYLES.rented,
              )}
            >
              {v.is_available ? "AVILABLE" : "RENTED"}
            </Badge>
          ),
        },
        {
          header: "Last Rented",
          render: (v) => (
            <span className="text-sm font-medium text-muted-foreground">
              {formatLastRented(v.last_rented)}
            </span>
          ),
        },
        {
          header: "Price / Day",
          headerClassName: "text-right",
          className: "text-right",
          render: (v) => (
            <span className="text-sm font-black tracking-tight">
              ₹{v.price_per_day.toLocaleString("en-IN")}
            </span>
          ),
        },
      ]}
      pagination={{
        currentPage,
        totalPages,
        total,
        label: "vehicles",
      }}
    />
  );
}
