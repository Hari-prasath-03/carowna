"use client";

import Image from "next/image";
import Link from "next/link";
import { Vendor } from "@/types";
import GenericTable from "@/components/layout/generic-table";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";

interface VendorTableProps {
  vendors: Vendor[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export default function VendorTable({
  vendors,
  currentPage,
  totalPages,
  total,
}: VendorTableProps) {

  return (
    <GenericTable
      header={{
        title: "All Vendors",
        subtitle: `${total} platform partner${total !== 1 ? "s" : ""}`,
      }}
      data={vendors}
      getRowKey={(v) => v.id}
      columns={[
        {
          header: "Vendor Name",
          render: (vendor) => (
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border/30">
                {vendor.profile_url ? (
                  <Image
                    src={vendor.profile_url}
                    alt={vendor.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Store className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-foreground">
                  {vendor.name}
                </p>
                <p className="text-[10px] font-semibold text-muted-foreground tracking-widest mt-0.5">
                  {vendor.email}
                </p>
              </div>
            </div>
          ),
        },
        {
          header: "Total Vehicles",
          headerClassName: "text-center",
          className: "text-center",
          render: (vendor) => (
            <span className="text-lg font-semibold tracking-tighter">
              {vendor.total}
            </span>
          ),
        },
        {
          header: "Bikes",
          headerClassName: "text-center",
          className: "text-center",
          render: (vendor) => (
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted/50 border border-border/30 text-sm font-semibold">
              {vendor.bikes}
            </span>
          ),
        },
        {
          header: "Cars",
          headerClassName: "text-center",
          className: "text-center",
          render: (vendor) => (
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted/50 border border-border/30 text-sm font-semibold">
              {vendor.cars}
            </span>
          ),
        },
        {
          header: "Luxury",
          headerClassName: "text-center",
          className: "text-center",
          render: (vendor) => (
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted/50 border border-border/30 text-sm font-semibold">
              {vendor.luxury}
            </span>
          ),
        },
        {
          header: "Actions",
          headerClassName: "text-right",
          className: "text-right",
          render: (vendor) => (
            <Link href={`/dashboard/vendors/${vendor.id}`}>
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
        label: "vendors",
      }}
    />
  );
}
