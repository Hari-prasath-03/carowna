import { Skeleton } from "@/components/ui/skeleton";

export default function BasicDetailsLoading() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="fixed top-0 left-0 right-0 bg-background/60 backdrop-blur-xl z-50 border-b border-border/40 px-4 h-16 flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-7 w-32" />
        <div className="w-10" />
      </header>

      <main className="pt-24 px-4 space-y-8 max-w-md mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="bg-card border border-border rounded-[2.5rem] p-6 space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          ))}
        </div>

        <Skeleton className="h-16 w-full rounded-3xl" />
      </main>
    </div>
  );
}
