import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export function ContactItem({
  icon: Icon,
  value,
}: {
  icon: LucideIcon;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

export function DetailItem({
  label,
  value,
  align = "left",
}: {
  label: string;
  value: string | null;
  align?: "left" | "right";
}) {
  return (
    <div className={cn("space-y-0.5", align === "right" && "text-right")}>
      <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/60">
        {label}
      </p>
      <p className="text-xs font-bold text-foreground uppercase tracking-wider">
        {value}
      </p>
    </div>
  );
}
