import {
  getVendorDrivers,
  getVendorDriverStats,
} from "@/service/vendor/drivers";
import { getUser } from "@/service/self-user";
import { redirect } from "next/navigation";
import VendorDriverStatsView from "@/components/vendor/drivers/vendor-driver-stats";
import VendorDriverTable from "@/components/vendor/drivers/vendor-driver-table";
import { Plus } from "lucide-react";
import Header from "@/components/admin/shared/header";
import { ADMIN_PAGE_SIZE } from "@/constants";
import Link from "next/link";

interface Props {
  searchParams: Promise<{
    page?: string;
    status?: string;
    availability?: string;
    search?: string;
  }>;
}

export default async function VendorDriversPage({ searchParams }: Props) {
  const [user, userErr] = await getUser();
  if (!user || userErr) redirect("/login");

  const sParams = await searchParams;
  const page = parseInt(sParams.page || "1");
  const filters = {
    status: sParams.status,
    search: sParams.search,
  };

  const [stats, { drivers, total }] = await Promise.all([
    getVendorDriverStats(user.id),
    getVendorDrivers(user.id, page, filters),
  ]);

  return (
    <div className="space-y-8 pb-8">
      <Header
        title="Drivers Management"
        disc="Track and manage your driver fleet and their compliance status."
        actionRender={() => (
          <Link
            href="/vendor/drivers/add"
            className="inline-flex py-3.5 rounded-xl px-5 font-black text-xs uppercase tracking-widest gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add New Driver
          </Link>
        )}
      />

      <VendorDriverStatsView stats={stats} />
      <VendorDriverTable
        drivers={drivers}
        total={total}
        currentPage={page}
        totalPages={Math.ceil(total / ADMIN_PAGE_SIZE)}
      />
    </div>
  );
}
