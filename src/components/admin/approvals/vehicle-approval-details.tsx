"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BOOKING_STATUS_BADGE_STYLES,
  APPROVAL_STATUS_STYLES,
  VEHICLE_TYPE_STYLES,
} from "@/constants/shared-styles";

import type { VehicleApprovalDetails } from "@/types";
import {
  Fuel,
  Settings2,
  Users,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";
import BackButton from "@/components/layout/back-button";
import PathTillNow from "@/components/admin/shared/path-till-now";
import approveVehicleAction from "@/actions/approvals/approval-vehicle";
import rejectVehicleAction from "@/actions/approvals/reject-vehicle";

interface Props {
  vehicle: VehicleApprovalDetails;
}

export default function VehicleApprovalDetailsView({ vehicle }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [remarks, setRemarks] = useState(vehicle.approval_remarks ?? "");

  const primaryImage =
    vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : null;

  const handleApprove = () => {
    startTransition(async () => {
      await approveVehicleAction(vehicle.id, remarks || undefined);
      router.push("/dashboard/pending-approvals");
      router.refresh();
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      await rejectVehicleAction(vehicle.id, remarks || undefined);
      router.push("/dashboard/pending-approvals");
      router.refresh();
    });
  };

  const specs = [
    { label: "Fuel Type", value: vehicle.fuel_type, Icon: Fuel },
    { label: "Transmission", value: vehicle.transmission, Icon: Settings2 },
    {
      label: "Seats",
      value: vehicle.capacity ? `${vehicle.capacity} Adults` : null,
      Icon: Users,
    },
  ].filter((s) => s.value);

  const docs = [
    { label: "RC Document", url: vehicle.rc_doc_url },
    { label: "Insurance Certificate", url: vehicle.insurance_doc_url },
    { label: "RTO Document", url: vehicle.rto_doc_url },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-2">
        <BackButton />
        <PathTillNow replace={{ this: vehicle.id, with: vehicle.name }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-card border shadow-sm">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={vehicle.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-semibold">
                No image uploaded
              </div>
            )}
          </div>

          <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">
              Supporting Documents
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {docs.map(({ label, url }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 p-4 bg-muted/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {label}
                    </p>
                  </div>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-bold text-primary hover:underline whitespace-nowrap"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">
                      Not uploaded
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">
              Approval Remarks
            </p>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              disabled={vehicle.approval_status !== "PENDING"}
              placeholder={
                vehicle.approval_status !== "PENDING"
                  ? "No remarks added."
                  : "Add remarks before approving or rejecting..."
              }
              rows={4}
              className="w-full resize-none rounded-xl border border-border/40 bg-muted/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-border disabled:opacity-60 disabled:cursor-not-allowed font-medium"
            />
            <p className="text-xs text-muted-foreground font-medium">
              Remarks are saved with the approval decision and visible only to
              the admin team.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  BOOKING_STATUS_BADGE_STYLES,
                  APPROVAL_STATUS_STYLES[vehicle.approval_status],
                )}
              >
                {vehicle.approval_status}
              </Badge>
              {vehicle.vehicle_type && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                    VEHICLE_TYPE_STYLES[vehicle.vehicle_type] ??
                      "bg-muted/20 text-muted-foreground border-border/30",
                  )}
                >
                  {vehicle.vehicle_type}
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-black tracking-tighter text-foreground">
                {vehicle.name}
              </h1>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-foreground">
                  ₹{vehicle.price_per_day.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground font-semibold">
                  /day
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Submitted by{" "}
              <span className="font-bold text-foreground">
                {vehicle.vendor.name}
              </span>{" "}
              on {format(new Date(vehicle.created_at), "MMM d, yyyy")}
            </p>

            <div className="border-t border-border/20 pt-4 flex flex-col gap-1.5">
              <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground mb-1">
                Identity
              </p>
              {[
                {
                  label: "Make & Model",
                  value: `${vehicle.brand ?? ""} ${vehicle.name}`.trim(),
                },
                {
                  label: "Registration No.",
                  value: vehicle.registration_number,
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col py-1">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    {label}
                  </p>
                  <p className="text-sm font-bold text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-1">
            <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground mb-3">
              Specifications
            </p>
            <div className="flex flex-col divide-y divide-border/20">
              {specs.map(({ label, value, Icon }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </div>
                  <span className="text-sm font-bold text-foreground capitalize">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {vehicle.approval_status === "PENDING" && (
            <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-3">
              <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">
                Decision
              </p>
              <Button
                onClick={handleApprove}
                disabled={isPending}
                className="w-full rounded-xl font-bold gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approve Vehicle
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isPending}
                className="w-full rounded-xl font-bold gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject Vehicle
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
