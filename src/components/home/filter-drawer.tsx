"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Bike, Car, Gem, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const vehicleTypes = [
  { id: "bike", label: "Bike", icon: Bike },
  { id: "car", label: "Car", icon: Car },
  { id: "luxury", label: "Luxury", icon: Gem },
];

const transmissions = ["automatic", "manual"];
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];

export default function FilterDrawer({
  children,
  minPriceBound = 0,
  maxPriceBound = 1000,
}: {
  children: React.ReactNode;
  minPriceBound?: number;
  maxPriceBound?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const [type, setType] = useState<string>(searchParams.get("type") || "All");
  const [transmission, setTransmission] = useState<string>(
    searchParams.get("transmission") || "",
  );
  const [priceRange, setPriceRange] = useState<number[]>([
    parseInt(searchParams.get("minPrice") || minPriceBound.toString()),
    parseInt(searchParams.get("maxPrice") || maxPriceBound.toString()),
  ]);
  const [fuelType, setFuelType] = useState<string>(
    searchParams.get("fuelType") || "",
  );

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);

    if (type !== "All") params.set("type", type);
    else params.delete("type");

    if (transmission) params.set("transmission", transmission);
    else params.delete("transmission");

    if (priceRange[0] !== minPriceBound)
      params.set("minPrice", priceRange[0].toString());
    else params.delete("minPrice");

    if (priceRange[1] !== maxPriceBound)
      params.set("maxPrice", priceRange[1].toString());
    else params.delete("maxPrice");

    if (fuelType) params.set("fuelType", fuelType);
    else params.delete("fuelType");

    router.push(`/?${params.toString()}`, { scroll: false });
    setOpen(false);
  };

  const handleReset = () => {
    setType("All");
    setTransmission("");
    setPriceRange([minPriceBound, maxPriceBound]);
    setFuelType("");
    router.push("/?", { scroll: false });
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="px-4 pb-8 max-h-[90vh]">
        <DrawerHeader className="relative flex items-center justify-between border-b pb-4 pt-0">
          <DrawerTitle className="text-lg font-bold">Filters</DrawerTitle>
          <button
            onClick={handleReset}
            className="text-sm font-semibold text-foreground/70"
          >
            Clear filters
          </button>
        </DrawerHeader>

        <div className="max-w-4xl mx-auto mt-6 space-y-8 overflow-y-auto px-1 pb-6 no-scrollbar">
          <section className="space-y-4">
            <h3 className="text-[15px] font-bold">Vehicle Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {vehicleTypes.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setType(v.id === type ? "All" : v.id)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                    type === v.id
                      ? "border-primary bg-accent/30"
                      : "border-border/40 bg-background",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <v.icon
                      className={cn(
                        "h-5 w-5",
                        type === v.id
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-bold",
                        type === v.id
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {v.label}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border flex items-center justify-center transition-all",
                      type === v.id
                        ? "bg-primary border-primary"
                        : "border-border",
                    )}
                  >
                    {type === v.id && (
                      <Check className="h-3 w-3 text-accent-foreground" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[15px] font-bold">Transmission</h3>
            <div className="flex p-1.5 bg-muted rounded-xl gap-1">
              {transmissions.map((t) => (
                <button
                  key={t}
                  onClick={() => setTransmission(t)}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-bold capitalize transition-all",
                    transmission === t
                      ? "bg-accent-foreground/80 text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-white/50",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold">Price / Day</h3>
              <div className="bg-accent/40 px-3 py-1 rounded-full text-xs font-bold">
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </div>
            </div>
            <div className="px-2 pt-4">
              <Slider
                value={priceRange}
                min={minPriceBound}
                max={maxPriceBound}
                step={1}
                onValueChange={setPriceRange}
                className="py-4"
              />
              <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground/60">
                <span>₹{minPriceBound}</span>
                <span>
                  ₹
                  {Math.floor(
                    minPriceBound + (maxPriceBound - minPriceBound) / 4,
                  )}
                </span>
                <span>
                  ₹
                  {Math.floor(
                    minPriceBound + (maxPriceBound - minPriceBound) / 2,
                  )}
                </span>
                <span>
                  ₹
                  {Math.floor(
                    minPriceBound + (3 * (maxPriceBound - minPriceBound)) / 4,
                  )}
                </span>
                <span>₹{maxPriceBound}+</span>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[15px] font-bold">Fuel Type</h3>
            <div className="flex flex-wrap gap-2">
              {fuelTypes.map((f) => (
                <button
                  key={f}
                  onClick={() => setFuelType(fuelType === f ? "" : f)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-sm font-bold transition-all border",
                    fuelType === f
                      ? "bg-primary text-accent-foreground border-primary"
                      : "bg-background text-foreground border-border/40 hover:bg-accent/20",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </section>
        </div>

        <DrawerFooter className="px-0 pt-6">
          <Button
            onClick={handleApply}
            className="h-12 rounded-2xl text-base font-bold dark:text-accent-foreground"
          >
            Apply Filters
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
