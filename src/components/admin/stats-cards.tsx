import { getDashboardStats } from "@/service/admin";
import {
  Users,
  Store,
  Car,
  CalendarCheck,
  TrendingUp,
  IndianRupee,
} from "lucide-react";

export default async function StatsCards() {
  const stats = await getDashboardStats();

  const items = [
    {
      label: "Total Users",
      value: stats.users.toLocaleString(),
      icon: Users,
      trend: "+12%",
    },
    {
      label: "Total Vendors",
      value: stats.vendors.toLocaleString(),
      icon: Store,
      trend: "+5%",
    },
    {
      label: "Total Vehicles",
      value: stats.vehicles.toLocaleString(),
      icon: Car,
      trend: "+8%",
    },
    {
      label: "Bookings",
      value: stats.bookings.toLocaleString(),
      icon: CalendarCheck,
      trend: "+15%",
    },
    {
      label: "Revenue",
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: IndianRupee,
      trend: "+20%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-card p-6 rounded-2xl border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-2.5 rounded-xl bg-muted/50 border border-border/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <item.icon className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/10">
              <TrendingUp className="h-3 w-3" />
              {item.trend}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-none mb-1.5">
              {item.label}
            </p>
            <h3 className="text-2xl font-black tracking-tighter text-foreground group-hover:translate-x-1 transition-transform duration-300">
              {item.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
