import PathTillNow from "@/components/admin/shared/path-till-now";
import BackButton from "@/components/layout/back-button";
import Header from "@/components/admin/shared/header";
import DriverForm from "@/components/vendor/drivers/driver-form";

export default function AddDriverPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <BackButton />
        <PathTillNow />
      </div>

      <Header
        title="List New Driver"
        disc="Add a professional driver to your fleet network"
      />
      <DriverForm />
    </div>
  );
}
