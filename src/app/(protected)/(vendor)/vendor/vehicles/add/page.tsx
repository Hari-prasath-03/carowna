import PathTillNow from "@/components/admin/shared/path-till-now";
import BackButton from "@/components/layout/back-button";
import Header from "@/components/admin/shared/header";
import VehicleForm from "@/components/vendor/vehicles/vehicle-form";

export default function AddVehiclePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <BackButton />
        <PathTillNow />
      </div>

      <Header
        title="Add New Vehicle"
        disc="List a new asset in your fleet inventory"
      />
      <VehicleForm />
    </div>
  );
}
