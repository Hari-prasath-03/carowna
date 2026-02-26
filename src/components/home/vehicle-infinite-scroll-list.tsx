"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import VehicleCard from "./vehicle-card";
import { Vehicle } from "@/types";
import { Loader2 } from "lucide-react";

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
            key={`${vehicle.id}-${vehicle.name}`}
            id={vehicle.id}
            brand={vehicle.brand}
            name={vehicle.name}
            price={vehicle.price_per_day}
            rating={vehicle.rating}
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
            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-bold">
                Loading more vehicles...
              </span>
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
