import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getDashboardStats,
  getRecentBookings,
  getRevenueTrends,
  getPendingApprovalsCount,
} from "@/service/admin";
import { StatsCards } from "@/components/admin/stats-cards";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { ApprovalsOverview } from "@/components/admin/approvals-overview";
import { RecentBookingsTable } from "@/components/admin/recent-bookings";

export default async function AdminDashboardPage() {
  const [statsRes, bookingsRes, revenueRes, pendingCount] = await Promise.all([
    getDashboardStats(),
    getRecentBookings(5),
    getRevenueTrends(),
    getPendingApprovalsCount(),
  ]);

  const stats = statsRes[0] || {
    users: 0,
    vendors: 0,
    vehicles: 0,
    bookings: 0,
    revenue: 0,
  };
  const bookings = bookingsRes[0] || [];
  const revenueTrends = revenueRes[0] || [];

  return (
    <div className="space-y-10">
      {/* Header Section */}
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
          <Button
            variant="outline"
            className="h-12 border-border/40 rounded-xl font-bold bg-card shadow-sm px-6 hover:bg-muted/50 transition-colors"
          >
            <Calendar className="h-4 w-4 mr-2 opacity-70" />
            Last 30 Days
          </Button>
          <Button className="h-12 rounded-xl font-bold px-8 shadow-xl shadow-primary/20 bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsCards stats={stats} />

      {/* Middle Section: Chart and Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueTrends} />
        </div>
        <div className="lg:col-span-1">
          <ApprovalsOverview pendingCount={pendingCount} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="pb-10">
        <RecentBookingsTable bookings={bookings} />
      </div>
    </div>
  );
}
