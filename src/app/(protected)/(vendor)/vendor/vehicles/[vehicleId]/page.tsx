import { notFound, redirect } from "next/navigation";
import { getVendorVehicleDetails } from "@/service/vendor/vehicles";
import { getUser } from "@/service/self-user";
import VehicleDetailsHeader from "@/components/vendor/vehicle-details/vehicle-details-header";
import VehicleGallery from "@/components/vendor/vehicle-details/vehicle-gallery";
import VehicleSpecsCard from "@/components/vendor/vehicle-details/vehicle-specs-card";
import VehicleDocumentsCard from "@/components/vendor/vehicle-details/vehicle-documents-card";
import VehiclePerformance from "@/components/vendor/vehicle-details/vehicle-performance";
import ApprovalStatusCard from "@/components/vendor/shared/approval-status-card";
import toggleVehicleAvailability from "@/actions/vehicles/toggle-vehicle-availability";
import BackButton from "@/components/layout/back-button";
import PathTillNow from "@/components/admin/shared/path-till-now";

interface Props {
  params: Promise<{ vehicleId: string }>;
}

export default async function VendorVehicleDetailsPage({ params }: Props) {
  const [user, userErr] = await getUser();
  if (!user || userErr) redirect("/login");

  const { vehicleId } = await params;
  const vehicle = await getVendorVehicleDetails(vehicleId);

  if (!vehicle) notFound();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-2">
        <BackButton />
        <PathTillNow replace={{ this: vehicleId, with: vehicle.name }} />
      </div>

      <VehicleDetailsHeader
        name={vehicle.name}
        status={vehicle.approval_status}
        id={vehicle.id}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <VehicleGallery images={vehicle.images} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <VehicleSpecsCard
            brand={vehicle.brand}
            type={vehicle.vehicle_type}
            reg={vehicle.registration_number}
            fuel={vehicle.fuel_type}
            capacity={vehicle.capacity}
            price={vehicle.price_per_day}
          />
          <ApprovalStatusCard
            id={vehicle.id}
            status={vehicle.approval_status}
            isAvailable={vehicle.is_available}
            onToggle={toggleVehicleAvailability}
          />
        </div>
      </div>

      <VehicleDocumentsCard
        rcUrl={vehicle.rc_doc_url}
        insuranceUrl={vehicle.insurance_doc_url}
        rtoUrl={vehicle.rto_verification_doc_url}
      />

      <VehiclePerformance
        performance={vehicle.performance}
        bookings={vehicle.recentBookings}
      />
    </div>
  );
}
