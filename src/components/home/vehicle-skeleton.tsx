import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function VehicleSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border-none shadow-sm bg-card py-0 mb-6">
      <CardContent className="p-0">
        <div className="relative aspect-4/3 overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-5 w-20 ml-auto" />
              <Skeleton className="h-3 w-12 ml-auto" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-muted/30"
              >
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-3 w-10" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function VehicleListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <VehicleSkeleton key={i} />
      ))}
    </div>
  );
}
