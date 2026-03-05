import { Skeleton } from "@/components/ui/skeleton";

export default function BookingLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b border-border px-4 h-16 flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-6 w-32" />
        <div className="w-10" />
      </header>

      <main className="pt-20 px-4 max-w-lg mx-auto space-y-8">
        {/* Vehicle Summary Skeleton */}
        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden p-5 flex gap-4">
          <Skeleton className="h-24 w-24 rounded-3xl shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24 mt-4" />
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            </div>
          </div>

          <Skeleton className="h-16 w-full rounded-3xl shadow-xl" />
        </div>
      </main>
    </div>
  );
}
