"use client";

import { useMemo } from "react";

interface RevenueTrendsProps {
  data: { name: string; value: number }[];
}

export default function RevenueChart({ data }: RevenueTrendsProps) {
  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.value), 1000),
    [data],
  );

  return (
    <div className="bg-card p-8 rounded-2xl border border-border/40 shadow-sm">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-xl font-black tracking-tight">Revenue Trends</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 opacity-80">
            Monthly breakdown of platform earnings
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-tight">
              Current
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-muted/40" />
            <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">
              Previous
            </span>
          </div>
        </div>
      </div>

      <div className="relative h-75 flex items-end justify-between gap-4 px-2">
        {/* Y-Axis Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-full border-t border-dashed border-border/40"
            />
          ))}
          <div className="w-full border-t border-border/10" />
        </div>

        {/* Bars */}
        {data.map((d) => (
          <div
            key={d.name}
            className="flex-1 flex flex-col items-center gap-4 group relative"
          >
            <div className="w-full flex items-end justify-center gap-1.5 h-62.5">
              {/* Previous Month Placeholder (Light) */}
              <div
                className="w-full max-w-10 bg-muted/20 rounded-t-lg transition-all duration-500"
                style={{ height: `${(d.value / maxValue) * 70}%` }}
              />
              {/* Current Month (Primary) */}
              <div
                className="w-full max-w-10 bg-primary rounded-t-lg transition-all duration-700 relative hover:bg-primary/90 cursor-pointer"
                style={{ height: `${(d.value / maxValue) * 90}%` }}
              >
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-black px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-20 shadow-xl border border-border/20 translate-y-2 group-hover:translate-y-0">
                  ₹{d.value.toLocaleString()}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-tighter text-muted-foreground opacity-80">
              {d.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
