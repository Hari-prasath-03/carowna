"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Home, History, User } from "lucide-react";

const navItems = [
  { label: "HOME", icon: Home, href: "/" },
  { label: "PROFILE", icon: User, href: "/profile" },
  { label: "HISTORY", icon: History, href: "/history" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-primary-foreground/95 backdrop-blur-sm border-t border-border/40 h-16 md:hidden">
      <div className="flex items-center justify-around h-full max-w-lg mx-auto">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-16 transition-colors",
              pathname === href
                ? "text-primary"
                : "text-muted-foreground opacity-90",
            )}
          >
            <Icon
              className={cn("h-5 w-5", pathname === href && "stroke-[2.5px]")}
            />
            <span className="text-[10px] font-bold tracking-wider">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
