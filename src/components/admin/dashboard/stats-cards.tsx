import { Users, Store, Car, CalendarCheck, IndianRupee } from "lucide-react";

interface StatsCardsProps {
  stats: {
    users: number;
    vendors: number;
    vehicles: number;
    bookings: number;
    revenue: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    {
      label: "Total Users",
      value: stats.users,
      icon: Users,
    },
    {
      label: "Total Vendors",
      value: stats.vendors,
      icon: Store,
    },
    {
      label: "Total Vehicles",
      value: stats.vehicles,
      icon: Car,
    },
    {
      label: "Bookings",
      value: stats.bookings,
      icon: CalendarCheck,
    },
    {
      label: "Revenue",
      value: `₹${stats.revenue}`,
      icon: IndianRupee,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-card p-6 rounded-2xl border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2.5 rounded-xl bg-muted/50 border border-border/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <item.icon className="h-5 w-5" />
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
