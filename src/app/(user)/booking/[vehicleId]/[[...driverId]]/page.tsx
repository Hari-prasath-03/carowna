import { notFound, redirect } from "next/navigation";
import { getDriverById } from "@/service/drivers";
import { getUser } from "@/service/self-user";
import { getVehicleById } from "@/service/vehicles";

import BookingForm from "@/components/user/vehicles/booking-form";
import BackButton from "@/components/layout/back-button";
import { Driver } from "@/types";

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

  const [vehicle, vehicleErr] = await getVehicleById(vehicleId);
  if (vehicleErr || !vehicle) return notFound();

  let driver: Driver | null = null;
  const actualDriverId = driverId?.[0];

  if (actualDriverId) {
    const [driverData, driverErr] = await getDriverById(actualDriverId);
    if (!driverErr && driverData) driver = driverData;
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="fixed top-0 left-0 right-0 bg-background z-50 border-b border-border px-4 h-16 flex items-center justify-between">
        <BackButton />
        <h1 className="text-lg font-black text-foreground uppercase tracking-tight">
          Confirm Booking
        </h1>
        <div className="w-10" />
      </header>

      <BookingForm vehicle={vehicle} driver={driver} user={user} />
    </div>
  );
}
