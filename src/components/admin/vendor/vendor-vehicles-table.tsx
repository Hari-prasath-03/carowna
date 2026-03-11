"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { VendorVehicle } from "@/types";
import GenericTable from "@/components/layout/generic-table";
import { Car, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VendorVehiclesTableProps {
  vehicles: VendorVehicle[];
  currentPage: number;
  totalPages: number;
  total: number;
}

const TYPE_STYLES: Record<string, string> = {
  bike: "bg-orange-500/10 text-orange-600 border-orange-500/30 hover:bg-orange-500/10",
  car: "bg-blue-500/10 text-blue-600 border-blue-500/30 hover:bg-blue-500/10",
  luxury:
    "bg-purple-500/10 text-purple-600 border-purple-500/30 hover:bg-purple-500/10",
};

const STATUS_STYLES: Record<VendorVehicle["approval_status"], string> = {
  APPROVED:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10",
  PENDING:
    "bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/10",
  REJECTED: "bg-red-500/10 text-red-600 border-red-500/30 hover:bg-red-500/10",
};

const AVAILABILITY_STYLES = {
  available:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10",
  rented:
    "bg-rose-500/10 text-rose-600 border-rose-500/30 hover:bg-rose-500/10",
};

import { differenceInCalendarDays } from "date-fns";
import { Activity } from "react";

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
  const pathname = usePathname();
  const showPagination = totalPages > 1;
  const pageStart = (currentPage - 1) * 10 + 1;
  const pageEnd = Math.min(currentPage * 10, total);

  if (vehicles.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border/40 shadow-sm p-16 flex flex-col items-center justify-center gap-4 text-center">
        <Car className="h-10 w-10 text-muted-foreground/40" />
        <div>
          <p className="font-semibold text-foreground">No vehicles listed</p>
          <p className="text-sm text-muted-foreground mt-1">
            This vendor has not added any vehicles yet.
          </p>
        </div>
      </div>
    );
  }

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
                TYPE_STYLES[v.vehicle_type],
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
                STATUS_STYLES[v.approval_status] ?? STATUS_STYLES.PENDING,
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
                  ? AVAILABILITY_STYLES.available
                  : AVAILABILITY_STYLES.rented,
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
      footer={() => (
        <Activity mode={showPagination ? "visible" : "hidden"}>
          <div className="flex items-center justify-between px-8 py-4 border-t border-border/10 bg-muted/5">
            <p className="text-[11px] font-semibold text-muted-foreground">
              Showing {pageStart} to {pageEnd} of {total} vehicles
            </p>
            <div className="flex items-center gap-1.5">
              <Link
                href={`${pathname}?page=${currentPage - 1}`}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-lg border border-border/40 text-muted-foreground hover:bg-muted/50 transition-colors",
                  currentPage <= 1 && "pointer-events-none opacity-30",
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`${pathname}?page=${p}`}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-lg border text-xs font-bold transition-colors",
                    p === currentPage
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/40 text-muted-foreground hover:bg-muted/50",
                  )}
                >
                  {p}
                </Link>
              ))}
              <Link
                href={`${pathname}?page=${currentPage + 1}`}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-lg border border-border/40 text-muted-foreground hover:bg-muted/50 transition-colors",
                  currentPage >= totalPages && "pointer-events-none opacity-30",
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Activity>
      )}
    />
  );
}
