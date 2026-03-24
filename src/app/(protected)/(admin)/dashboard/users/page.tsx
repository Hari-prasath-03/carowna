import Header from "@/components/admin/shared/header";
import { getUsers, getUserStats } from "@/service/admin/users";
import UserStats from "@/components/admin/users/user-stats";
import UsersTable from "@/components/admin/users/users-table";

interface UsersPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function UsersManagementPage({
  searchParams,
}: UsersPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));

  const [stats, { users, total, totalPages }] = await Promise.all([
    getUserStats(),
    getUsers(page),
  ]);

  return (
    <div className="space-y-8">
      <Header
        title="User Management"
        disc="Manage platform users, their activities, and account status"
      />
      <UserStats stats={stats} />
      <UsersTable
        users={users}
        currentPage={page}
        totalPages={totalPages}
        total={total}
      />
    </div>
  );
}
