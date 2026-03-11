import { VendorStats as VendorStatsType } from "@/types";

interface VendorStatsProps {
  stats: VendorStatsType;
}

export default function VendorStats({ stats }: VendorStatsProps) {
  const items = [
    { label: "Active Vendors", value: stats.total },
    { label: "Total Bikes", value: stats.bikes },
    { label: "Total Cars", value: stats.cars },
    { label: "Total Luxury", value: stats.luxury },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-card rounded-2xl border border-border/40 shadow-sm p-6 flex flex-col gap-2"
        >
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            {item.label}
          </p>
          <p className="text-3xl font-black tracking-tighter text-foreground">
            {item.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
