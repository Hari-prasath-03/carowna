import { ClipboardList, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApprovalStats } from "@/types";

const CARDS = (stats: ApprovalStats) => [
  {
    title: "Total Pending",
    value: stats.totalPending,
    Icon: ClipboardList,
    iconColor: "text-amber-500",
  },
  {
    title: "Approved Today",
    value: stats.approvedToday,
    Icon: CheckCircle,
    iconColor: "text-emerald-500",
  },
  {
    title: "Rejected Today",
    value: stats.rejectedToday,
    Icon: XCircle,
    iconColor: "text-rose-500",
  },
];

export default function ApprovalStats({ stats }: { stats: ApprovalStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {CARDS(stats).map((card) => {
        const Icon = card.Icon;
        return (
          <div
            key={card.title}
            className="bg-card rounded-xl border border-border/40 p-6 flex flex-col justify-between shadow-sm min-h-35"
          >
            <div className="flex items-start justify-between">
              <Icon className={cn("size-5 mt-1.5", card.iconColor)} />
            </div>
            <div className="mt-4 space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                {card.title}
              </p>
              <h3 className="text-3xl font-black tracking-tighter text-foreground">
                {card.value.toLocaleString()}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
