import {
  getVendorDashboardStats,
  getVendorRecentBookings,
} from "@/service/vendor/dashboard";
import { getUser } from "@/service/self-user";
import { redirect } from "next/navigation";
import VendorStats from "@/components/vendor/vendor-stats";
import RecentBookings from "@/components/vendor/recent-bookings";
import Header from "@/components/admin/shared/header";

export default async function VendorDashboardPage() {
  const [user, userErr] = await getUser();
  if (!user || userErr) redirect("/login");

  const [stats, recentBookings] = await Promise.all([
    getVendorDashboardStats(user.id),
    getVendorRecentBookings(user.id),
  ]);

  return (
    <div className="space-y-8 pb-8">
      <Header
        title="Fleet Overview"
        disc="Real-time performance metrics and active operations."
      />

      <VendorStats stats={stats} />

      <div className="mt-8">
        <RecentBookings bookings={recentBookings} />
      </div>
    </div>
  );
}
