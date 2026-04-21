import { getDrivers, getDriverStats } from "@/service/admin/drivers";
import { getUser } from "@/service/self-user";
import { redirect } from "next/navigation";
import DriverTable from "@/components/admin/drivers/driver-table";
import { Plus } from "lucide-react";
import Header from "@/components/admin/shared/header";
import { ADMIN_PAGE_SIZE } from "@/constants/others";
import Link from "next/link";
import DriverStatsView from "@/components/admin/drivers/driver-stats";

interface Props {
  searchParams: Promise<{
    page?: string;
    status?: string;
    availability?: string;
    search?: string;
  }>;
}

export default async function DriversPage({ searchParams }: Props) {
  const [user, userErr] = await getUser();
  if (!user || userErr) redirect("/login");

  const sParams = await searchParams;
  const page = parseInt(sParams.page || "1");
  const filters = {
    status: sParams.status,
    search: sParams.search,
  };

  const [stats, { drivers, total }] = await Promise.all([
    getDriverStats(),
    getDrivers(page, filters),
  ]);

  return (
    <div className="space-y-8 pb-8">
      <Header
        title="Drivers Management"
        disc="Track and manage driver fleet and their compliance status."
        actionRender={() => (
          <Link
            href="/dashboard/drivers/add"
            className="inline-flex py-3.5 rounded-xl px-5 font-black text-xs uppercase tracking-widest gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add New Driver
          </Link>
        )}
      />

      <DriverStatsView stats={stats} />
      <DriverTable
        drivers={drivers}
        total={total}
        currentPage={page}
        totalPages={Math.ceil(total / ADMIN_PAGE_SIZE)}
      />
    </div>
  );
}
