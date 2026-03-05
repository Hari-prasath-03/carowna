import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 bg-background/60 backdrop-blur-xl z-50 border-b border-border/40 px-4 h-16 flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </header>

      <main className="pt-20 px-4 space-y-8 max-w-md mx-auto">
        {/* User Info Card Skeleton */}
        <div className="bg-card rounded-[2.5rem] p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Skeleton className="h-10 w-full rounded-2xl" />
            <Skeleton className="h-10 w-full rounded-2xl" />
          </div>
        </div>

        {/* KYC Section Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32 ml-2" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-40 w-full rounded-3xl" />
            <Skeleton className="h-40 w-full rounded-3xl" />
          </div>
        </div>

        {/* Support & Actions Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-16 w-full rounded-3xl" />
          <Skeleton className="h-16 w-full rounded-3xl" />
          <Skeleton className="h-16 w-full rounded-3xl" />
        </div>
      </main>
    </div>
  );
}
