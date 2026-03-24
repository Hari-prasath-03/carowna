import { Users, UserCheck, UserPlus } from "lucide-react";
import { UserStats as UserStatsType } from "@/types";

interface UserStatsProps {
  stats: UserStatsType;
}

export default function UserStats({ stats }: UserStatsProps) {
  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString("en-IN"),
      icon: Users,
    },
    {
      label: "Active Users",
      value: stats.activeUsers.toLocaleString("en-IN"),
      icon: UserCheck,
    },
    {
      label: "New Users This Month",
      value: stats.newUsersThisMonth.toLocaleString("en-IN"),
      icon: UserPlus,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-card rounded-2xl border border-border/40 shadow-sm p-6 flex flex-col justify-between"
          >
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
              {card.label}
            </p>
            <div className="flex items-end justify-between mt-4">
              <p className="text-4xl font-black tracking-tighter text-foreground leading-none">
                {card.value}
              </p>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
