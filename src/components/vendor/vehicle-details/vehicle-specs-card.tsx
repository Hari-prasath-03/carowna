"use client";

import { Car, Fuel, Users, Settings2, Tag, CreditCard } from "lucide-react";

interface Props {
  brand: string | null;
  type: string | null;
  reg: string;
  fuel: string | null;
  capacity: number | null;
  price: number;
}

export default function VehicleSpecsCard({
  brand,
  type,
  reg,
  fuel,
  capacity,
  price,
}: Props) {
  const specs = [
    { label: "BRAND", value: brand, icon: Car },
    { label: "TYPE", value: type, icon: Tag },
    { label: "REGISTRATION", value: reg, icon: CreditCard },
    { label: "FUEL TYPE", value: fuel, icon: Fuel },
    {
      label: "CAPACITY",
      value: capacity ? `${capacity} Passengers` : null,
      icon: Users,
    },
    {
      label: "PRICE/DAY",
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
              <p className="text-sm font-black text-foreground uppercase tracking-tight">
                {spec.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
