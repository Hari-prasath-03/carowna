import {
  getApprovalStats,
  getPendingVehicles,
} from "@/service/admin/approvals";
import ApprovalStats from "@/components/admin/approvals/approval-stats";
import ApprovalsTable from "@/components/admin/approvals/approvals-table";
import Header from "@/components/admin/shared/header";

interface PendingApprovalsPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
  }>;
}

export default async function PendingApprovalsPage({
  searchParams,
}: PendingApprovalsPageProps) {
  const { page: pageParam, status } = await searchParams;

  const currentPage = Math.max(1, Number(pageParam ?? 1));
  const currentStatus = status ?? "pending";

  const [stats, listResult] = await Promise.all([
    getApprovalStats(),
    getPendingVehicles(currentPage, currentStatus.toUpperCase()),
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
        currentStatus={currentStatus}
      />
    </div>
  );
}
