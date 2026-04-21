"use client";

import Link from "next/link";
import * as icons from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "../layout/logo";
import { AuthUser } from "@/types";

interface SidebarProps {
  parentPath: string;
  header: {
    title: string;
    subtitle: string;
  };
  menuItems: {
    icon: keyof typeof icons;
    label: string;
    href: string;
  }[];
  user: {
    details: AuthUser;
  };
}

export default function Sidebar({
  parentPath,
  header,
  menuItems,
  user,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border/50 flex flex-col z-50">
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3">
          <Logo width={32} height={32} />
          <div className="flex flex-col">
            <h2 className="text-base font-black uppercase tracking-tighter leading-none">
              {header.title}
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1.5 opacity-80">
              {header.subtitle}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== parentPath && pathname.startsWith(item.href));

          const Icon = (icons as Record<string, unknown>)[
            item.icon
          ] as icons.LucideIcon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold transition-all duration-300 group relative",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground/60 group-hover:text-foreground",
                  )}
                />
              )}
              <span>{item.label}</span>
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-foreground/40" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border/40">
        <div className="bg-muted/30 rounded-2xl p-4 flex items-center justify-between group relative overflow-hidden transition-all duration-300 border border-transparent hover:border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-sm font-black text-primary-foreground shadow-md ring-4 ring-primary/5">
              {user.details.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-tight text-foreground line-clamp-1">
                {user.details.name}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">
                {user.details.role}
              </span>
            </div>
          </div>

          <div className="relative h-8 w-8 flex items-center justify-center">
            <icons.Settings className="h-4 w-4 text-muted-foreground group-hover:opacity-0 group-hover:rotate-90 transition-all duration-500 absolute" />
            <form
              action={async () => {
                const { default: logoutAction } = await import(
                  "@/actions/auth/logout"
                );
                await logoutAction();
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 flex items-center justify-center"
            >
              <button
                type="submit"
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors group/btn"
                title="Logout"
              >
                <icons.LogOut className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}
