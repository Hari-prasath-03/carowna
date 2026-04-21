"use client";

import {
  Car,
  Fuel,
  Users,
  Settings2,
  Tag,
  CreditCard,
  Palette,
  MapPin,
} from "lucide-react";

interface Props {
  brand: string | null;
  type: string | null;
  reg: string;
  fuel: string | null;
  capacity: number | null;
  price: number;
  color: string | null;
  state: string | null;
  district: string | null;
}

export default function VehicleSpecsCard({
  brand,
  type,
  reg,
  fuel,
  capacity,
  price,
  color,
  state,
  district,
}: Props) {
  const specs = [
    { label: "brand", value: brand, icon: Car },
    { label: "type", value: type, icon: Tag },
    { label: "registration", value: reg, icon: CreditCard },
    { label: "fuel type", value: fuel, icon: Fuel },
    { label: "color", value: color, icon: Palette },
    { label: "state", value: state, icon: MapPin },
    { label: "district", value: district, icon: MapPin },
    {
      label: "capacity",
      value: capacity ? `${capacity} Passengers` : null,
      icon: Users,
    },
    {
      label: "price/day",
      value: `₹${price.toLocaleString()}`,
      icon: Settings2,
    },
  ].filter((s) => s.value);

  return (
    <div className="bg-card border border-border/40 rounded-3xl p-8 shadow-sm flex flex-col gap-6">
      <p className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground opacity-60">
        Technical Specifications
      </p>

      <div className="grid grid-cols-2 gap-y-6 gap-x-8">
        {specs.map((spec) => {
          const Icon = spec.icon;
          return (
            <div key={spec.label} className="space-y-1.5">
              <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground tracking-widest uppercase opacity-50">
                <Icon className="size-3" />
                {spec.label}
              </div>
              <p className="text-sm font-semibold text-foreground uppercase tracking-tight">
                {spec.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
