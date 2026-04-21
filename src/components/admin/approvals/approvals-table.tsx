"use client";

import { usePathname, useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GenericTable from "@/components/layout/generic-table";
import FormSelect from "@/components/forms/form-select";
import { ApprovalListItem } from "@/types";
import {
  BOOKING_STATUS_BADGE_STYLES,
  APPROVAL_STATUS_STYLES,
  VEHICLE_TYPE_STYLES,
} from "@/constants/shared-styles";
import Link from "next/link";

interface ApprovalsTableProps {
  items: ApprovalListItem[];
  currentPage: number;
  totalPages: number;
  total: number;
  currentStatus: string;
}

export default function ApprovalsTable({
  items,
  currentPage,
  totalPages,
  total,
  currentStatus,
}: ApprovalsTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  const buildUrl = (params: Record<string, string>) => {
    const sp = new URLSearchParams({
      status: currentStatus,
      page: String(currentPage),
      ...params,
    });
    return `${pathname}?${sp.toString()}`;
  };

  const handleStatusChange = (status: string) => {
    router.push(buildUrl({ status, page: "1" }));
  };

  return (
    <GenericTable
      header={{
        title: "Approval Requests",
        subtitle: "Review and manage pending vehicle and driver registrations",
        renderRightSection: () => (
          <div className="flex items-center gap-3">
            <div className="w-40">
              <FormSelect
                label=""
                name="status"
                defaultValue={currentStatus}
                onValueChange={handleStatusChange}
                options={[
                  { label: "Status: All", value: "all" },
                  { label: "Pending", value: "pending" },
                  { label: "Approved", value: "approved" },
                  { label: "Rejected", value: "rejected" },
                ]}
                containerClassName="gap-0 font-semibold"
              />
            </div>
          </div>
        ),
      }}
      data={items}
      getRowKey={(item) => item.id}
      columns={[
        {
          header: "Vendor",
          render: (item) => (
            <span className="text-sm font-bold text-foreground opacity-90 truncate max-w-32 inline-block">
              {item.vendor_name}
            </span>
          ),
        },
        {
          header: "Name",
          render: (item) => (
            <span className="text-sm font-semibold text-foreground truncate max-w-36 inline-block">
              {item.name}
            </span>
          ),
        },
        {
          header: "Type",
          render: (item) =>
            item.vehicle_type ? (
              <Badge
                variant="outline"
                className={cn(
                  "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                  VEHICLE_TYPE_STYLES[item.vehicle_type] ??
                    "bg-muted/20 text-muted-foreground border-border/30",
                )}
              >
                {item.vehicle_type}
              </Badge>
            ) : (
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Driver
              </span>
            ),
        },
        {
          header: "Date Submitted",
          render: (item) => (
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              {format(new Date(item.created_at), "MMM d, yyyy")}
            </span>
          ),
        },
        {
          header: "Status",
          render: (item) => (
            <Badge
              variant="outline"
              className={cn(
                BOOKING_STATUS_BADGE_STYLES,
                APPROVAL_STATUS_STYLES[item.approval_status] ??
                  "bg-muted/10 text-muted-foreground border-border/30",
              )}
            >
              {item.approval_status}
            </Badge>
          ),
        },
        {
          header: "Actions",
          headerClassName: "text-right",
          className: "text-right",
          render: (item) => (
            <Link href={`/dashboard/pending-approvals/${item.id}`}>
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
        label: "requests",
        extraParams: {
          status: currentStatus,
        },
      }}
    />
  );
}
