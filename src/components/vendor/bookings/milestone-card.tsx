import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  History as HistoryIcon,
} from "lucide-react";
import {
  PAYMENT_STATUS_STYLES,
  APPROVAL_STATUS_STYLES,
} from "@/constants/shared-styles";

interface Props {
  milestone: number;
  title: string;
  amount: number;
  payment?: {
    status: string;
    created_at: string;
  };
}

const MILESTONE_THEMES = {
  SETTLED: {
    container: PAYMENT_STATUS_STYLES.SUCCESS,
    color: "text-emerald-600",
    icon: CheckCircle2,
    badge: "SETTLED",
    footer: "Payment Required",
  },
  PENDING: {
    container: APPROVAL_STATUS_STYLES.PENDING,
    color: "text-amber-600",
    icon: AlertCircle,
    badge: "PENDING",
    footer: "Payment Required",
  },
  AWAITING: {
    container: PAYMENT_STATUS_STYLES.CREATED,
    color: "text-blue-600",
    icon: HistoryIcon,
    badge: "AWAITING",
    footer: "Post-Trip Clearing",
  },
};

export default function MilestoneCard({
  milestone,
  title,
  amount,
  payment,
}: Props) {
  const isSettled = payment?.status === "SUCCESS";
  const state = isSettled
    ? "SETTLED"
    : milestone === 1
      ? "PENDING"
      : "AWAITING";
  const theme = MILESTONE_THEMES[state];

  return (
    <div
      className={cn(
        "p-6 rounded-2xl border relative overflow-hidden transition-all shadow-sm",
        theme.container,
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            MILESTONE {milestone}
          </span>
          <div className={cn(theme.color)}>
            <theme.icon className="size-4" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase text-muted-foreground">
            {title}
          </p>
          <h4 className="text-2xl font-black tracking-tighter text-foreground">
            ₹{Number(amount).toLocaleString()}
          </h4>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/10">
          <span className="text-[10px] font-bold uppercase text-muted-foreground/60">
            {payment
              ? format(new Date(payment.created_at), "MMM dd, yyyy")
              : theme.footer}
          </span>
          <Badge
            variant="outline"
            className={cn(
              "text-[9px] font-black tracking-widest px-2 py-0.5 border-current/20 bg-current/5",
              theme.color,
            )}
          >
            {theme.badge}
          </Badge>
        </div>
      </div>
    </div>
  );
}
