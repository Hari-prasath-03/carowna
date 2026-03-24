import {
  getApprovalStats,
  getPendingVehicles,
  getPendingDrivers,
} from "@/service/admin/approvals";
import ApprovalStats from "@/components/admin/approvals/approval-stats";
import ApprovalsTable from "@/components/admin/approvals/approvals-table";
import Header from "@/components/admin/shared/header";

interface PendingApprovalsPageProps {
  searchParams: Promise<{
    tab?: string;
    page?: string;
    status?: string;
  }>;
}

export default async function PendingApprovalsPage({
  searchParams,
}: PendingApprovalsPageProps) {
  const { tab, page: pageParam, status } = await searchParams;

  const currentTab = tab === "drivers" ? "drivers" : "vehicles";
  const currentPage = Math.max(1, Number(pageParam ?? 1));
  const currentStatus = status ?? "pending";

  const [stats, listResult] = await Promise.all([
    getApprovalStats(),
    currentTab === "drivers"
      ? getPendingDrivers(currentPage, currentStatus.toUpperCase())
      : getPendingVehicles(currentPage, currentStatus.toUpperCase()),
  ]);

  return (
    <div className="space-y-8">
      <Header
        title="Approvals"
        disc="Review and manage vehicle and driver registration requests."
      />
      <ApprovalStats stats={stats} />
      <ApprovalsTable
        items={listResult.items}
        currentPage={currentPage}
        totalPages={listResult.totalPages}
        total={listResult.total}
        currentTab={currentTab}
        currentStatus={currentStatus}
      />
    </div>
  );
}
