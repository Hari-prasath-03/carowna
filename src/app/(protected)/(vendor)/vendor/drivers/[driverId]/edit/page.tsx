import { notFound, redirect } from "next/navigation";
import { getVendorDriverDetails } from "@/service/vendor/drivers";
import { getUser } from "@/service/self-user";
import DriverForm from "@/components/vendor/drivers/driver-form";
import PathTillNow from "@/components/admin/shared/path-till-now";
import BackButton from "@/components/layout/back-button";
import Header from "@/components/admin/shared/header";

interface Props {
  params: Promise<{ driverId: string }>;
}

export default async function EditDriverPage({ params }: Props) {
  const [user, userErr] = await getUser();
  if (!user || userErr) redirect("/login");

  const { driverId } = await params;
  const driver = await getVendorDriverDetails(driverId);

  if (!driver) notFound();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-2">
        <BackButton />
        <PathTillNow replace={{ this: driverId, with: `Edit ${driver.name}` }} />
      </div>

      <Header
        title="Edit Driver Profile"
        disc={`Updating information for ${driver.name}`}
      />

      <DriverForm initialData={driver} />
    </div>
  );
}
