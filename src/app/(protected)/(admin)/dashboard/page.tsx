import { Download } from "lucide-react";
import { getRecentBookings, getRevenueTrends } from "@/service/admin";

import StatsCards from "@/components/admin/stats-cards";
import RevenueChart from "@/components/admin/revenue-chart";
import ApprovalsOverview from "@/components/admin/approvals-overview";
import RecentBookingsTable from "@/components/admin/recent-bookings";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const [bookings, revenue] = await Promise.all([
    getRecentBookings(),
    getRevenueTrends(),
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/10">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-80">
            Real-time platform performance and statistics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="py-5 rounded-xl font-bold px-8 shadow-sm shadow-primary/20">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart data={revenue} />
        </div>
        <div className="lg:col-span-1">
          <ApprovalsOverview />
        </div>
      </div>

      <div className="pb-10">
        <RecentBookingsTable bookings={bookings} />
      </div>
    </div>
  );
}
