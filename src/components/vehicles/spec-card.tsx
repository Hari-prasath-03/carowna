import { LucideIcon } from "lucide-react";

interface SpecCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

export function SpecCard({ label, value, icon: Icon }: SpecCardProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 px-2 rounded-2xl bg-primary-foreground border border-border/40 shadow-sm gap-2 min-w-0">
      <div className="h-10 w-10 rounded-full bg-muted/40 flex items-center justify-center mb-1">
        <Icon className="h-5 w-5 text-foreground/70" />
      </div>
      <div className="text-center px-1">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">
          {label}
        </p>
        <p className="text-[13px] font-black text-foreground uppercase tracking-tight leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
          {value}
        </p>
      </div>
    </div>
  );
}
