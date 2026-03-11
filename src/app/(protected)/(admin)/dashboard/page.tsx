import { Download } from "lucide-react";
import {
  getDashboardStats,
  getPendingApprovalsCount,
  getRecentBookings,
  getRevenueTrends,
} from "@/service/admin/dashboard";

import StatsCards from "@/components/admin/dashboard/stats-cards";
import RevenueChart from "@/components/admin/dashboard/revenue-chart";
import ApprovalsOverview from "@/components/admin/dashboard/approvals-overview";
import RecentBookingsTable from "@/components/admin/dashboard/recent-bookings";
import Header from "@/components/admin/shared/header";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const [bookings, revenue, stats, pendingCount] = await Promise.all([
    getRecentBookings(),
    getRevenueTrends(),
    getDashboardStats(),
    getPendingApprovalsCount(),
  ]);

  return (
    <div className="space-y-10">
      <Header
        title="Dashboard Overview"
        disc="Real-time platform performance and statistics"
        actionRender={() => (
          <div className="flex items-center gap-3">
            <Button className="py-5 rounded-xl font-bold px-8 shadow-sm shadow-primary/20">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        )}
      />

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart data={revenue} />
        </div>
        <div className="lg:col-span-1">
          <ApprovalsOverview pendingCount={pendingCount} />
        </div>
      </div>

      <div className="pb-10">
        <RecentBookingsTable bookings={bookings} />
      </div>
    </div>
  );
}
