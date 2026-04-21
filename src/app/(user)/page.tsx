import { Suspense } from "react";
import HomeHeader from "@/components/user/home/home-header";
import CategoryFilters from "@/components/user/home/category-filters";
import VehicleInfiniteScrollList from "@/components/user/home/vehicle-infinite-scroll-list";
import VehicleListSkeleton from "@/components/user/home/vehicle-skeleton";

import { getVehicles } from "@/service/user/vehicles";
import { VehicleType } from "@/types";

type vehicleSearch = {
  searchParams: Promise<{
    type?: string;
    search?: string;
    transmission?: string;
    minPrice?: string;
    maxPrice?: string;
    fuelType?: string;
  }>;
};

async function VehicleList({
  searchParams,
}: {
  searchParams: vehicleSearch["searchParams"];
}) {
  const { type, search, transmission, minPrice, maxPrice, fuelType } =
    await searchParams;

  const [vehicles, err] = await getVehicles({
    type: (type as VehicleType) || "All",
    search: search || "",
    transmission: transmission as "automatic" | "manual",
    minPrice: minPrice ? parseInt(minPrice) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    fuelType: fuelType || "",
    page: 1,
    limit: 5,
  });

  if (err) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-card rounded-2xl mx-4 mt-8">
        <p className="text-destructive font-bold text-lg mb-2">
          Error Loading Vehicles
        </p>
        <p className="text-muted-foreground text-sm">
          {err?.reason || "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <VehicleInfiniteScrollList
      initialVehicles={vehicles}
      initialTotal={vehicles.length}
    />
  );
}

export default async function VehiclesPage({ searchParams }: vehicleSearch) {
  return (
    <div className="pb-32">
      <HomeHeader />

      <main className="space-y-6 mt-16 sm:mt-24">
        <Suspense
          fallback={<div className="h-12 w-full animate-pulse bg-muted/20" />}
        >
          <CategoryFilters />
        </Suspense>

        <div className="px-4 md:px-6">
          <Suspense fallback={<VehicleListSkeleton />}>
            <VehicleList searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
