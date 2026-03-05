import { Skeleton } from "@/components/ui/skeleton";

export default function VehicleDetailsLoading() {
  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 bg-background/60 backdrop-blur-xl z-50 border-b border-border/40 px-4 h-16 flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-7 w-40" />
        <div className="w-5" />
      </header>

      {/* Hero Gallery Skeleton */}
      <div className="relative w-full aspect-4/3 bg-muted overflow-hidden mt-16">
        <Skeleton className="h-full w-full" />
      </div>

      <main className="px-5 py-8 space-y-10">
        <section className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-64 pt-1" />
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-10 w-24 ml-auto" />
              <Skeleton className="h-3 w-16 ml-auto" />
            </div>
          </div>
        </section>

        {/* Specs Skeleton */}
        <section className="space-y-5">
          <Skeleton className="h-4 w-32" />
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-24 w-full rounded-3xl" />
            <Skeleton className="h-24 w-full rounded-3xl" />
            <Skeleton className="h-24 w-full rounded-3xl" />
          </div>
        </section>

        {/* Verification Skeleton */}
        <section className="space-y-5">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-3xl" />
            <Skeleton className="h-20 w-full rounded-3xl" />
            <Skeleton className="h-20 w-full rounded-3xl" />
          </div>
        </section>
      </main>

      {/* Footer CTA Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-xl border-t border-border/50">
        <Skeleton className="h-16 w-full rounded-3xl" />
      </div>
    </div>
  );
}
