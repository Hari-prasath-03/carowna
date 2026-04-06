import {
  getVendorVehicles,
  getVendorVehicleStats,
} from "@/service/vendor/vehicles";
import { getUser } from "@/service/self-user";
import { redirect } from "next/navigation";
import VendorVehicleStatsView from "@/components/vendor/vehicles/vendor-vehicle-stats";
import VendorVehicleTable from "@/components/vendor/vehicles/vendor-vehicle-table";
import { Plus } from "lucide-react";
import Header from "@/components/admin/shared/header";
import { ADMIN_PAGE_SIZE } from "@/constants";
import Link from "next/link";

interface Props {
  searchParams: Promise<{
    page?: string;
    status?: string;
    type?: string;
    search?: string;
  }>;
}

export default async function VendorVehiclesPage({ searchParams }: Props) {
  const [user, userErr] = await getUser();
  if (!user || userErr) redirect("/login");

  const sParams = await searchParams;
  const page = parseInt(sParams.page || "1");
  const filters = {
    status: sParams.status,
    type: sParams.type,
    search: sParams.search,
  };

  const [stats, { vehicles, total }] = await Promise.all([
    getVendorVehicleStats(user.id),
    getVendorVehicles(user.id, page, filters),
  ]);

  return (
    <div className="space-y-8 pb-8">
      <Header
        title="Vehicles Inventory"
        disc="Manage your fleet performance, track approval statuses, and update pricing."
        actionRender={() => (
          <Link
            href="/vendor/vehicles/add"
            className="inline-flex py-3.5 rounded-xl px-5 font-black text-xs uppercase tracking-widest gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add New Vehicle
          </Link>
        )}
      />

      <VendorVehicleStatsView stats={stats} />
      <VendorVehicleTable
        vehicles={vehicles}
        total={total}
        currentPage={page}
        totalPages={Math.ceil(total / ADMIN_PAGE_SIZE)}
      />
    </div>
  );
}
