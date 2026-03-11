import BackButton from "@/components/layout/back-button";
import AddVendorForm from "@/components/admin/vendor/add-vendor-form";
import PathTillNow from "@/components/admin/shared/path-till-now";
import { getVendorProfile } from "@/service/admin/vendor";
import { notFound } from "next/navigation";
import Header from "@/components/admin/shared/header";

export default async function EditVendorPage({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = await params;
  const vendor = await getVendorProfile(vendorId);

  if (!vendor) notFound();

  return (
    <main className="space-y-6">
      <div className="flex items-center gap-2 pb-2">
        <BackButton />
        <PathTillNow
          replace={{
            this: vendorId,
            with: vendor.name,
          }}
        />
      </div>

      <Header
        title="Edit Vendor"
        disc={`Update the profile and account details for ${vendor.name}.`}
      />

      <AddVendorForm initialData={vendor} />
    </main>
  );
}
