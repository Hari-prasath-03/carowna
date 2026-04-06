import { notFound, redirect } from "next/navigation";
import { getVendorDriverDetails } from "@/service/vendor/drivers";
import { getUser } from "@/service/self-user";
import DriverDetailsHeader from "@/components/vendor/drivers/driver-details-header";
import DriverSpecsCard from "@/components/vendor/drivers/driver-specs-card";
import DriverDocumentsCard from "@/components/vendor/drivers/driver-documents-card";
import DriverPerformance from "@/components/vendor/drivers/driver-performance";
import ApprovalStatusCard from "@/components/vendor/shared/approval-status-card";
import toggleDriverAvailability from "@/actions/drivers/toggle-availability";
import BackButton from "@/components/layout/back-button";
import PathTillNow from "@/components/admin/shared/path-till-now";

interface Props {
  params: Promise<{ driverId: string }>;
}

export default async function VendorDriverDetailsPage({ params }: Props) {
  const [user, userErr] = await getUser();
  if (!user || userErr) redirect("/login");

  const { driverId } = await params;
  const driver = await getVendorDriverDetails(driverId);

  if (!driver) notFound();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-2">
        <BackButton />
        <PathTillNow replace={{ this: driverId, with: driver.name }} />
      </div>

      <DriverDetailsHeader
        name={driver.name}
        status={driver.approval_status}
        id={driver.id}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <DriverSpecsCard
            experience={driver.years_of_exp}
            rating={driver.rating}
            dob={driver.date_of_birth}
            gender={driver.gender}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-3">
          <ApprovalStatusCard
            id={driver.id}
            status={driver.approval_status}
            isAvailable={driver.availability_status}
            onToggle={toggleDriverAvailability}
            entityType="driver"
            licenseUrl={driver.license_doc_url}
          />
          <DriverDocumentsCard licenseUrl={driver.license_doc_url} />
        </div>
      </div>

      <DriverPerformance
        performance={driver.performance}
        bookings={driver.recentBookings}
      />
    </div>
  );
}
