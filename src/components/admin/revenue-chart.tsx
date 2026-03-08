"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipContentProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const CustomTooltip = ({
  active,
  payload,
}: Partial<TooltipContentProps<ValueType, NameType>>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-foreground text-background text-[10px] font-black px-3 py-2 rounded-xl shadow-2xl border border-border/20 backdrop-blur-md">
        <p className="uppercase tracking-widest opacity-70 mb-1">
          {payload[0].payload.name}
        </p>
        <p className="text-sm">₹{payload[0].value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const chartData = useMemo(() => data, [data]);

  if (!chartData) return null;

  return (
    <div className="bg-card p-8 rounded-2xl border border-border/40 shadow-sm flex flex-col h-full">
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

      <div className="flex-1 min-h-75 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={8}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
                  stopOpacity={0.8}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="currentColor"
              className="text-border/40"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "currentColor",
                fontSize: 10,
                fontWeight: 800,
                className: "text-muted-foreground uppercase tracking-tighter",
              }}
              dy={15}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "currentColor",
                fontSize: 10,
                fontWeight: 700,
                className: "text-muted-foreground/60",
              }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "var(--muted)", opacity: 0.1 }}
              animationDuration={300}
            />
            <Bar
              dataKey="value"
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
              barSize={32}
              animationBegin={200}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
