import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentSuccessLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b border-border px-4 h-16 flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-5 w-40" />
        <div className="w-9" />
      </header>

      <main className="pt-20 px-5 max-w-lg mx-auto space-y-8">
        {/* Status Header Skeleton */}
        <div className="text-center space-y-4 py-4">
          <div className="flex justify-center">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-4 w-72" />
          </div>
        </div>

        {/* Vehicle Card Skeleton */}
        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
          <Skeleton className="aspect-video w-full" />
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-6 pt-2">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-40" />
                </div>
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary Skeleton */}
        <div className="bg-card border border-border rounded-[2.5rem] p-6 space-y-6">
          <div className="flex gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="space-y-4 pt-2 border-t border-border">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>

        {/* Navigation Actions Skeleton */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
