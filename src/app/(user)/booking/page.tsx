import { notFound } from "next/navigation";
import { getVehicleById } from "@/service/vehicles";
import { BookingForm } from "@/components/vehicles/booking-form";
import { getDriverById } from "@/service/drivers";
import { Driver } from "@/types";

interface BookingPageProps {
  searchParams: Promise<{
    vehicleId: string;
    driverId?: string;
  }>;
}

export default async function BookingDetailsPage({
  searchParams,
}: BookingPageProps) {
  const { vehicleId, driverId } = await searchParams;
  if (!vehicleId) return notFound();

  const [vehicle, err] = await getVehicleById(vehicleId);
  if (err || !vehicle) return notFound();

  let driver: Driver | null = null;
  if (driverId) {
    const [driverData, driverErr] = await getDriverById(driverId);
    if (!driverErr && driverData) driver = driverData;
  }

  return <BookingForm vehicle={vehicle} driver={driver} />;
}
