import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Skeleton for Header */}
      <div className="fixed top-0 left-0 right-0 bg-background/60 backdrop-blur-xl z-50 border-b border-border/40 px-4 h-16 flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      <div className="pt-20 px-4 space-y-8 max-w-md mx-auto">
        {/* Skeleton for main content area */}
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-[2.5rem]" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );
}
