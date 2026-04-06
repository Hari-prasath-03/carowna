import { getVendorVehicleDetails } from "@/service/vendor/vehicles";
import { getUser } from "@/service/self-user";
import { redirect } from "next/navigation";
import PathTillNow from "@/components/admin/shared/path-till-now";
import BackButton from "@/components/layout/back-button";
import Header from "@/components/admin/shared/header";
import VehicleForm from "@/components/vendor/vehicles/vehicle-form";

interface Props {
  params: Promise<{
    vehicleId: string;
  }>;
}

export default async function EditVehiclePage({ params }: Props) {
  const { vehicleId } = await params;
  const [user] = await getUser();

  if (!user) redirect("/login");
  const vehicle = await getVendorVehicleDetails(vehicleId);

  if (!vehicle) redirect("/vendor/vehicles");
  if (vehicle.vendor_id !== user.id) redirect("/vendor/vehicles");

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <BackButton />
        <PathTillNow replace={{ this: vehicleId, with: vehicle.name }} />
      </div>

      <Header
        title="Edit Vehicle"
        disc={`Updating details for ${vehicle.name} (${vehicle.registration_number})`}
      />

      <VehicleForm initialData={vehicle} />
    </div>
  );
}
