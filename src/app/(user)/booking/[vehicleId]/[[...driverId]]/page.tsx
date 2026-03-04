import { notFound, redirect } from "next/navigation";
import { getVehicleById } from "@/service/vehicles";
import { BookingForm } from "@/components/vehicles/booking-form";
import { getDriverById } from "@/service/drivers";
import { Driver } from "@/types";
import { getUser } from "@/service/self-user";
import { getUserDetails } from "@/service/user";

interface BookingPageProps {
  params: Promise<{
    vehicleId: string;
    driverId?: string[];
  }>;
}

export default async function BookingDetailsPage({ params }: BookingPageProps) {
  const { vehicleId, driverId } = await params;

  if (!vehicleId) return notFound();

  const [user, userErr] = await getUser();
  if (userErr || !user) return redirect("/login");

  const [userDetails, detailsErr] = await getUserDetails(user.id);
  if (detailsErr || !userDetails)
    return redirect("/profile?error=details_missing");

  const [vehicle, vehicleErr] = await getVehicleById(vehicleId);
  if (vehicleErr || !vehicle) return notFound();

  let driver: Driver | null = null;
  const actualDriverId = driverId?.[0];

  if (actualDriverId) {
    const [driverData, driverErr] = await getDriverById(actualDriverId);
    if (!driverErr && driverData) driver = driverData;
  }

  return (
    <BookingForm vehicle={vehicle} driver={driver} userDetails={userDetails} />
  );
}
