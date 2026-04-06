"use client";

import { Briefcase, Star, Calendar, User2 } from "lucide-react";

interface Props {
  experience: number;
  rating: number;
  dob: string | null;
  gender: string | null;
}

export default function DriverSpecsCard({
  experience,
  rating,
  dob,
  gender,
}: Props) {
  const specs = [
    { label: "EXPERIENCE", value: `${experience} Years`, icon: Briefcase },
    {
      label: "RATING",
      value: rating > 0 ? rating.toFixed(1) : "N/A",
      icon: Star,
    },
    { label: "DATE OF BIRTH", value: dob || "Not Set", icon: Calendar },
    { label: "GENDER", value: gender || "Not Set", icon: User2 },
  ].filter((s) => s.value);

  return (
    <div className="bg-card border border-border/40 rounded-3xl p-8 shadow-sm flex flex-col gap-6 h-full">
      <p className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground opacity-60">
        Professional Profile
      </p>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
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
