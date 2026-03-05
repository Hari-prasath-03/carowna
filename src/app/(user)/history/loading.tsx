import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b border-border px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-7 w-40" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      <main className="pt-16 max-w-lg mx-auto">
        {/* Tabs Skeleton */}
        <div className="sticky top-16 bg-background z-40 border-b border-border">
          <div className="flex px-4 gap-4 py-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-20 shrink-0" />
            ))}
          </div>
        </div>

        {/* List Skeleton */}
        <div className="px-5 pt-6 space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-[2.5rem] overflow-hidden p-5 space-y-4"
            >
              <div className="flex gap-5">
                <Skeleton className="h-24 w-24 rounded-3xl shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-12 w-full rounded-2xl" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
