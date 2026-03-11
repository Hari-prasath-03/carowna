import PathTillNow from "@/components/admin/shared/path-till-now";
import AddVendorForm from "@/components/admin/vendor/add-vendor-form";
import BackButton from "@/components/layout/back-button";
import Header from "@/components/admin/shared/header";

export default function AddVendorPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <BackButton />
        <PathTillNow />
      </div>

      <Header title="Add Vendor" disc="Register a new platform partner" />

      <AddVendorForm />
    </div>
  );
}
