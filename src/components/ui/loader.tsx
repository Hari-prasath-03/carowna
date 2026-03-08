import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
}

export function TopProgressBar({ className }: LoaderProps) {
  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-200 h-0.75 overflow-hidden",
        className,
      )}
    >
      <div className="h-full w-full animate-progress-fast bg-primary" />
    </div>
  );
}

export function Loader({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full animate-spin border-2 border-transparent border-t-primary border-r-primary" />
    </div>
  );
}
