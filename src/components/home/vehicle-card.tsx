/* eslint-disable @next/next/no-img-element */
import { Star, Gauge, Users, Battery, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface VehicleCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  transmission: string;
  capacity: number;
  fuelType: string;
  imageUrl: string;
}

export default function VehicleCard({
  id,
  name,
  brand,
  price,
  rating,
  transmission,
  capacity,
  fuelType,
  imageUrl,
}: VehicleCardProps) {
  return (
    <div className="block">
      <Card className="group overflow-hidden rounded-2xl border-none shadow-sm hover:shadow-md transition-all bg-card py-0 mb-6">
        <Link href={`/vehicle/${id}`} className="block">
          <CardContent className="p-0">
            <div className="relative aspect-4/3 overflow-hidden">
              <img
                src={imageUrl}
                alt={`${brand} ${name}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-primary-foreground/95 backdrop-blur-sm rounded-lg shadow-sm">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold text-foreground">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-[1.125rem] font-bold text-foreground leading-tight">
                    {brand} {name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium mt-0.5">
                    {name} Model
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-foreground">
                    ₹{price}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground block -mt-1 uppercase tracking-wider">
                    /day
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-y border-border/40">
                <div className="flex items-center gap-1.5 px-1">
                  <Gauge className="h-4 w-4 text-muted-foreground/70" />
                  <span className="text-[0.8125rem] font-bold text-muted-foreground">
                    {transmission}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-1">
                  <Users className="h-4 w-4 text-muted-foreground/70" />
                  <span className="text-[0.8125rem] font-bold text-muted-foreground">
                    {capacity} Seats
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-1">
                  {fuelType === "Electric" ? (
                    <Zap className="h-4 w-4 text-muted-foreground/70" />
                  ) : (
                    <Battery className="h-4 w-4 text-muted-foreground/70" />
                  )}
                  <span className="text-[0.8125rem] font-bold text-muted-foreground">
                    {fuelType}
                  </span>
                </div>
              </div>

              <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-sm active:scale-[0.98]">
                Book Now
              </Button>
            </div>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
}
