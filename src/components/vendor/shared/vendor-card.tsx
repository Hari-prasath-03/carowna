import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export default function VendorCard({
  title,
  icon: Icon,
  children,
  className,
  bodyClassName,
}: Props) {
  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border/40 shadow-sm overflow-hidden flex flex-col",
        className,
      )}
    >
      <div className="px-8 py-5 border-b border-border/10 bg-muted/5 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
          {title}
        </h3>
        <Icon className="size-4 text-muted-foreground opacity-50" />
      </div>

      <div className={cn("p-8", bodyClassName)}>{children}</div>
    </div>
  );
}
