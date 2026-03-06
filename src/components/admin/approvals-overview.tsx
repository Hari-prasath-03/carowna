"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ApprovalsOverviewProps {
  pendingCount: number;
}

export default function ApprovalsOverview({
  pendingCount,
}: ApprovalsOverviewProps) {
  return (
    <div className="bg-card p-8 rounded-2xl border border-border/40 shadow-sm h-full flex flex-col justify-between overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <CheckCircle2 className="h-32 w-32" />
      </div>

      <div className="relative z-10">
        <div className="space-y-3">
          <h2 className="text-2xl font-black tracking-tighter leading-tight text-foreground">
            Vehicle Approvals
          </h2>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            There are{" "}
            <span className="text-foreground underline underline-offset-2">
              {pendingCount} vehicle listings
            </span>{" "}
            awaiting verification. Timely approvals ensure a smooth vendor
            experience.
          </p>
        </div>
      </div>

      <Link
        href="/dashboard/pending-approvals"
        className="mt-10 flex items-center justify-between w-full bg-primary text-primary-foreground py-5 px-8 rounded-xl font-black uppercase tracking-tight text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group/btn shadow-xl shadow-primary/20"
      >
        <span>Review Requests</span>
        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
      </Link>
    </div>
  );
}
