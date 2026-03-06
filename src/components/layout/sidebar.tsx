"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Users,
  CalendarCheck,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "../layout/logo";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Store, label: "Vendors", href: "/dashboard/vendors" },
  { icon: Users, label: "Users", href: "/dashboard/users-management" },
  { icon: CalendarCheck, label: "Bookings", href: "/dashboard/bookings" },
  {
    icon: ShieldCheck,
    label: "Approvals",
    href: "/dashboard/pending-approvals",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border/50 flex flex-col z-50">
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3">
          <Logo width={32} height={32} />
          <div className="flex flex-col">
            <h2 className="text-base font-black uppercase tracking-tighter leading-none">
              Admin Panel
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1.5 opacity-80">
              Vehicle Platform
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold transition-all duration-300 group relative",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground/60 group-hover:text-foreground",
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-foreground/40" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border/40">
        <div className="bg-muted/30 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-muted/50 transition-all duration-300 border border-transparent hover:border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-sm font-black text-primary-foreground shadow-md ring-4 ring-primary/5">
              AJ
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-tight text-foreground">
                Alex Johnson
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">
                Super Admin
              </span>
            </div>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground group-hover:rotate-90 transition-transform duration-500" />
        </div>
      </div>
    </aside>
  );
}
