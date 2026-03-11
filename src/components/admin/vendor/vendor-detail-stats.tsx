import { VendorDetailStats as VendorDetailStatsType } from "@/types";
import { Car, CalendarCheck, IndianRupee, TrendingUp } from "lucide-react";

interface VendorDetailStatsProps {
  stats: VendorDetailStatsType;
}

export default function VendorDetailStats({ stats }: VendorDetailStatsProps) {
  const COMMISSION_RATE = 0.15;
  const commission = stats.totalEarnings * COMMISSION_RATE;

  const items = [
    {
      label: "Total Vehicles",
      value: stats.totalVehicles.toString(),
      icon: Car,
      note: "Total vehicles listed by vendor",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings.toString(),
      icon: CalendarCheck,
      note: "Total no. of bookings till now",
    },
    {
      label: "Total Earnings",
      value: `₹${stats.totalEarnings.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      note: "From successful payments",
    },
    {
      label: "Platform Commission",
      value: `₹${commission.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      icon: TrendingUp,
      note: "15% rate",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-card rounded-2xl border border-border/40 shadow-sm p-6 flex flex-col gap-3 group hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              {item.label}
            </p>
            <div className="p-2 rounded-xl bg-muted/50 border border-border/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <item.icon className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-3xl font-black tracking-tighter text-foreground">
            {item.value}
          </p>
          {item.note && (
            <p className="text-[10px] font-semibold text-muted-foreground">
              {item.note}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
