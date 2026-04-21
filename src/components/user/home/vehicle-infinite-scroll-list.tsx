"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import VehicleCard from "./vehicle-card";
import { Vehicle } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface VehicleInfiniteListProps {
  initialVehicles: Vehicle[];
  initialTotal: number;
}

export default function VehicleInfiniteScrollList({
  initialVehicles,
  initialTotal,
}: VehicleInfiniteListProps) {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialTotal === 5);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVehicles(initialVehicles);
    setHasMore(initialVehicles.length === 5);
    setPage(1);
  }, [initialVehicles]);

  const fetchMoreVehicles = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      const currentOffset = vehicles.length;
      const currentLimit = 3;

      params.set("offset", currentOffset.toString());
      params.set("limit", currentLimit.toString());

      const response = await fetch(`/api/vehicles?${params.toString()}`);
      const result: Vehicle[] = await response.json();

      if (response.ok) {
        if (result.length === 0) {
          setHasMore(false);
        } else {
          setVehicles((prev) => [...prev, ...result]);
          if (result.length < currentLimit) setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error loading more vehicles:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, vehicles.length, searchParams]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          fetchMoreVehicles();
        }
      },
      { threshold: 0.5 },
    );

    if (observerTarget.current) observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [loading, hasMore, page, fetchMoreVehicles]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            id={vehicle.id}
            brand={vehicle.brand}
            name={vehicle.name}
            price={vehicle.price_per_day}
            rating={4.8}
            transmission={vehicle.transmission}
            capacity={vehicle.capacity}
            fuelType={vehicle.fuel_type}
            imageUrl={vehicle.images[0]}
          />
        ))}
      </div>

      {hasMore && (
        <div ref={observerTarget} className="flex justify-center py-8">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-[2.5rem] overflow-hidden p-5 space-y-4 opacity-50"
                >
                  <Skeleton className="aspect-video w-full rounded-4xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <Skeleton className="h-12 w-full rounded-2xl" />
                    <Skeleton className="h-12 w-full rounded-2xl" />
                    <Skeleton className="h-12 w-full rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!hasMore && vehicles.length > 0 && (
        <p className="text-center text-muted-foreground text-sm font-mediumd italic">
          You&apos;ve reached the end! 🏁
        </p>
      )}
    </div>
  );
}
