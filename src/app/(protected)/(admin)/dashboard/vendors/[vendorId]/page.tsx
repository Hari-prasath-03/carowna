import { notFound } from "next/navigation";
import {
  getVendorProfile,
  getVendorDetailStats,
  getVendorVehicles,
} from "@/service/admin/vendor";
import VendorProfileHeader from "@/components/admin/vendor/vendor-profile-header";
import VendorDetailStats from "@/components/admin/vendor/vendor-detail-stats";
import VendorVehiclesTable from "@/components/admin/vendor/vendor-vehicles-table";

interface VendorDetailsPageProps {
  params: Promise<{ vendorId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function VendorDetailsPage({
  params,
  searchParams,
}: VendorDetailsPageProps) {
  const { vendorId } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));

  const [profile, stats, { vehicles, total, totalPages }] = await Promise.all([
    getVendorProfile(vendorId),
    getVendorDetailStats(vendorId),
    getVendorVehicles(vendorId, page, 5),
  ]);

  if (!profile) notFound();

  return (
    <div className="space-y-8">
      <VendorProfileHeader vendor={profile} />
      <VendorDetailStats stats={stats} />
      <VendorVehiclesTable
        vehicles={vehicles}
        currentPage={page}
        totalPages={totalPages}
        total={total}
      />
    </div>
  );
}
