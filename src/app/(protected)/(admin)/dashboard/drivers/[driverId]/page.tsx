import { notFound, redirect } from "next/navigation";
import { getDriverDetails } from "@/service/admin/drivers";
import { getUser } from "@/service/self-user";
import DriverDetailsHeader from "@/components/admin/drivers/driver-details-header";
import DriverSpecsCard from "@/components/admin/drivers/driver-specs-card";
import DriverDocumentsCard from "@/components/admin/drivers/driver-documents-card";
import DriverPerformance from "@/components/admin/drivers/driver-performance";
import toggleDriverAvailability from "@/actions/drivers/toggle-availability";
import BackButton from "@/components/layout/back-button";
import PathTillNow from "@/components/admin/shared/path-till-now";
import AvailabilityToggle from "@/components/vendor/shared/availability-toggle";

interface Props {
  params: Promise<{ driverId: string }>;
}

export default async function DriverDetailsPage({ params }: Props) {
  const [user, userErr] = await getUser();
  if (!user || userErr) redirect("/login");

  const { driverId } = await params;
  const driver = await getDriverDetails(driverId);

  if (!driver) notFound();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-2">
        <BackButton />
        <PathTillNow replace={{ this: driverId, with: driver.name }} />
      </div>

      <DriverDetailsHeader name={driver.name} id={driver.id} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <DriverSpecsCard
            experience={driver.years_of_exp}
            rating={driver.rating}
            dob={driver.date_of_birth}
            gender={driver.gender}
            pricePerDay={driver.price_per_day}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-card border border-border/40 rounded-3xl p-2 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl border border-border/5 group">
              <span className="text-[11px] font-black text-foreground truncate max-w-lg uppercase tracking-tight">
                Availability
              </span>
              <AvailabilityToggle
                id={driver.id}
                initialAvailable={driver.is_available}
                onToggle={toggleDriverAvailability}
              />
            </div>
          </div>

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
