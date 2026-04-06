"use client";

import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { APPROVAL_STATUS_STYLES } from "@/constants/shared-styles";
import AvailabilityToggle from "./availability-toggle";
import { cn } from "@/lib/utils";

interface ApprovalStatusCardProps {
  id: string;
  status: string;
  isAvailable: boolean;
  onToggle: (
    id: string,
    nextState: boolean,
  ) => Promise<{ success?: boolean; error?: string }>;
  entityType?: "vehicle" | "driver";
  licenseUrl?: string | null;
}

export default function ApprovalStatusCard({
  id,
  status,
  isAvailable,
  onToggle,
  entityType = "vehicle",
  licenseUrl,
}: ApprovalStatusCardProps) {
  const isApproved = status === "APPROVED";
  const isPending = status === "PENDING";

  const Icon = isApproved ? CheckCircle2 : isPending ? AlertCircle : XCircle;

  return (
    <div
      className={cn(
        "p-6 rounded-3xl border shadow-sm flex items-center justify-between gap-4 transition-all bg-card",
        APPROVAL_STATUS_STYLES[status],
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="size-5 shrink-0" />
        <div className="flex flex-col">
          <h3 className="text-sm font-black tracking-tight uppercase">
            {isApproved
              ? "Approved & Verified"
              : isPending
                ? "Pending Review"
                : "Rejected & Offline"}
          </h3>
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">
            {isApproved
              ? "Active in Marketplace"
              : isPending
                ? "Processing for Listing"
                : "Requires Correction"}
          </p>
          {entityType === "driver" && licenseUrl && (
            <a
              href={licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-black uppercase tracking-widest text-primary mt-2 hover:underline inline-flex items-center gap-1"
            >
              View License
            </a>
          )}
        </div>
      </div>

      <AvailabilityToggle
        id={id}
        initialAvailable={isAvailable}
        onToggle={onToggle}
        disabled={!isApproved}
        showLabel={false}
      />
    </div>
  );
}
