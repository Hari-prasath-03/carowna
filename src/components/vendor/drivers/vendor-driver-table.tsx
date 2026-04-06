"use client";

import { VendorDriver } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import GenericTable from "@/components/layout/generic-table";
import { APPROVAL_STATUS_STYLES } from "@/constants/shared-styles";
import { Eye, Pencil, Search, X, Star } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import FormSelect from "@/components/forms/form-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AvailabilityToggle from "@/components/vendor/shared/availability-toggle";
import toggleDriverAvailability from "@/actions/drivers/toggle-availability";

interface VendorDriverTableProps {
  drivers: VendorDriver[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export default function VendorDriverTable({
  drivers,
  total,
  currentPage,
  totalPages,
}: VendorDriverTableProps) {
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
        title: "Drivers Fleet",
        subtitle: `${total} TOTAL DRIVERS TRACKED`,
        renderRightSection: () => (
          <div className="flex items-center gap-3">
            <FormSelect
              label=""
              name="status"
              defaultValue={status}
              onValueChange={(v) => handleFilterChange("status", v)}
              containerClassName="w-[160px] gap-0 text-[10px]"
              options={[
                { label: "ALL STATUSES", value: "all" },
                { label: "PENDING", value: "pending" },
                { label: "APPROVED", value: "approved" },
                { label: "REJECTED", value: "rejected" },
              ]}
            />
            <div className="relative group w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <Input
                defaultValue={search}
                placeholder="Search drivers..."
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
      data={drivers}
      getRowKey={(item) => item.id}
      pagination={{
        currentPage,
        totalPages,
        total,
        label: "drivers",
        extraParams: Object.fromEntries(searchParams.entries()),
      }}
      columns={[
        {
          header: "NAME",
          render: (item) => (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted text-[10px] font-bold text-muted-foreground/40 uppercase border border-border/20">
                {item.name.charAt(0)}
              </div>
              <span className="text-sm font-black text-foreground tracking-tight uppercase">
                {item.name}
              </span>
            </div>
          ),
        },
        {
          header: "EXPERIENCE",
          render: (item) => (
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {item.years_of_exp} Years
            </span>
          ),
        },
        {
          header: "RATING",
          render: (item) => (
            <div className="flex items-center gap-1.5">
              <Star className="size-3 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-black text-foreground">
                {item.rating > 0 ? item.rating.toFixed(1) : "N/A"}
              </span>
            </div>
          ),
        },
        {
          header: "AVAILABILITY",
          className: "text-center",
          headerClassName: "text-center",
          render: (item) => (
            <div className="flex justify-center">
              <AvailabilityToggle
                id={item.id}
                initialAvailable={item.availability_status}
                onToggle={toggleDriverAvailability}
                disabled={item.approval_status !== "APPROVED"}
                showLabel={false}
              />
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
                APPROVAL_STATUS_STYLES[item.approval_status],
              )}
            >
              {item.approval_status}
            </Badge>
          ),
        },
        {
          header: "ACTIONS",
          className: "text-right",
          headerClassName: "text-right",
          render: (item) => (
            <div className="flex items-center justify-end gap-1">
              <Link
                href={`/vendor/drivers/${item.id}`}
                className="p-2 hover:bg-muted/40 rounded-lg transition-colors inline-flex group"
              >
                <Eye className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link
                href={`/vendor/drivers/${item.id}/edit`}
                className="p-2 hover:bg-muted/40 rounded-lg transition-colors inline-flex group"
              >
                <Pencil className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            </div>
          ),
        },
      ]}
    />
  );
}
