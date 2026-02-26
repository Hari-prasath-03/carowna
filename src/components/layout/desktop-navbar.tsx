"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DesktopNavbar() {
  const pathname = usePathname();

  const links = [
    {
      link: "/",
      name: "Vehicles",
    },
    {
      link: "/profile",
      name: "Profile",
    },
    {
      link: "/history",
      name: "History",
    },
  ];

  return (
    <nav className="hidden md:flex items-center gap-8 px-4 py-2 bg-muted/40 rounded-full border border-border/20 backdrop-blur-sm">
      {links.map((link) => {
        const isActive = pathname === link.link;
        return (
          <Link
            key={link.name}
            href={link.link}
            className={cn(
              "relative text-[13px] font-bold uppercase tracking-widest transition-all duration-300",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {link.name}
            {isActive && (
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-1 duration-500" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
