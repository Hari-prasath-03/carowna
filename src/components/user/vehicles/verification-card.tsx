"use client";

import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ICON_MAP = {
  insurance: ShieldCheck,
  rc: FileText,
  rto: BadgeCheck,
};

interface VerificationCardProps {
  label: string;
  subtitle: string;
  icon: keyof typeof ICON_MAP;
  verified: boolean;
  docUrl?: string;
}

export default function VerificationCard({
  label,
  subtitle,
  icon,
  verified,
  docUrl,
}: VerificationCardProps) {
  const Icon = ICON_MAP[icon];

  const handleView = () => {
    if (docUrl) window.open(docUrl, "_blank");
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-primary-foreground border border-border shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-muted/40 flex items-center justify-center">
          <Icon className="h-6 w-6 text-foreground/80" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-foreground">{label}</p>
          <p className="text-[10px] font-medium text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1.5">
          {verified ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />
          )}
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">
            {verified ? "Verified" : "Pending"}
          </span>
        </div>
        {docUrl && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-[10px] font-bold text-primary uppercase tracking-wider"
            onClick={handleView}
          >
            View
          </Button>
        )}
      </div>
    </div>
  );
}
