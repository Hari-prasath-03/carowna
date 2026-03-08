import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: number;
}

export function Loader({ className, size = 32 }: LoaderProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        className,
      )}
    >
      <Loader2
        className="animate-spin text-primary opacity-80"
        size={size}
        strokeWidth={2.5}
      />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
      <Loader size={48} />
    </div>
  );
}
