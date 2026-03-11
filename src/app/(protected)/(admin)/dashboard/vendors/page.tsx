import { Plus } from "lucide-react";
import { getVendors, getVendorStats } from "@/service/admin/vendor";
import Header from "@/components/admin/shared/header";
import VendorStats from "@/components/admin/vendor/vendor-stats";
import VendorTable from "@/components/admin/vendor/vendor-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface VendorsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function VendorsManagementPage({
  searchParams,
}: VendorsPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));

  const [stats, { vendors, total, totalPages }] = await Promise.all([
    getVendorStats(),
    getVendors(page),
  ]);

  return (
    <div className="space-y-8">
      <Header
        title="Vendor Management"
        disc="Manage platform partners and their vehicle fleets"
        actionRender={() => (
          <div className="flex items-center gap-3">
            <Link href="/dashboard/vendors/add">
              <Button className="py-5 rounded-xl font-bold px-8 shadow-sm shadow-primary/20">
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </Link>
          </div>
        )}
      />

      <VendorStats stats={stats} />
      <VendorTable
        vendors={vendors}
        currentPage={page}
        totalPages={totalPages}
        total={total}
      />
    </div>
  );
}
