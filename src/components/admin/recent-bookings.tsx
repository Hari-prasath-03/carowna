"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentBookingsProps {
  bookings: {
    id: string;
    created_at: string;
    booking_status: string;
    total_amount: number;
    user?: {
      display_name: string;
      avatar_url: string;
    };
    vehicle?: {
      name: string;
      brand: string;
    };
    vendor?: {
      display_name: string;
    };
  }[];
}

export default function RecentBookingsTable({ bookings }: RecentBookingsProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/40 shadow-sm overflow-hidden">
      <div className="p-8 flex justify-between items-center border-b border-border/10 bg-muted/5">
        <div>
          <h2 className="text-xl font-black tracking-tighter text-foreground">
            Recent Bookings
          </h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-70">
            Monitor platform-wide booking activity
          </p>
        </div>
        <Link
          href="/dashboard/bookings"
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors group"
        >
          View All{" "}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-muted/30 border-b border-border/20 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              <th className="px-8 py-5">Booking ID</th>
              <th className="px-8 py-5">Customer</th>
              <th className="px-8 py-5">Vehicle</th>
              <th className="px-8 py-5">Vendor</th>
              <th className="px-8 py-5 text-right">Amount</th>
              <th className="px-8 py-5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/5">
            {bookings.map((b) => (
              <tr
                key={b.id}
                className="hover:bg-muted/10 transition-colors group cursor-default"
              >
                <td className="px-8 py-5">
                  <span className="text-xs font-black tracking-tighter text-muted-foreground group-hover:text-foreground transition-colors">
                    #{b.id.slice(0, 8).toUpperCase()}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted/50 flex items-center justify-center overflow-hidden border border-border/20 relative shadow-inner ring-2 ring-primary/5">
                      {b.user?.avatar_url ? (
                        <Image
                          src={b.user.avatar_url}
                          alt={b.user.display_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-muted-foreground opacity-50" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-foreground opacity-90">
                      {b.user?.display_name || "Unknown User"}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-black tracking-tight text-foreground">
                      {b.vehicle?.name}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {b.vehicle?.brand}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-bold text-muted-foreground/80">
                    {b.vendor?.display_name || "Platform"}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <span className="text-sm font-black tracking-tighter text-foreground">
                    ₹{b.total_amount?.toLocaleString()}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <span
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border",
                      b.booking_status === "COMPLETED"
                        ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20"
                        : b.booking_status === "REQUESTED"
                          ? "bg-amber-500/5 text-amber-600 border-amber-500/20"
                          : "bg-muted text-muted-foreground border-border/40",
                    )}
                  >
                    {b.booking_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
