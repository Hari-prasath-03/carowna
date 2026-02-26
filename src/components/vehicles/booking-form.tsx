"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBookingAction } from "@/service/bookings";
import { Driver, Vehicle } from "@/types";
import { BookingLocations } from "../booking/booking-locations";
import { BookingPeriod } from "../booking/booking-period";
import { BookingDriverToggle } from "../booking/booking-driver-toggle";
import { BookingCostSummary } from "../booking/booking-cost-summary";
import { BookingSubmitButton } from "../booking/booking-submit-button";
import BackButton from "../layout/back-button";

interface BookingFormProps {
  vehicle: Vehicle;
  driver: Driver | null;
}

export function BookingForm({ vehicle, driver }: BookingFormProps) {
  const router = useRouter();

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [driverState, setDriverState] = useState(driver);

  const costSummary = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.max(0, end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const rentalFee = vehicle.price_per_day * days;
    let driverCharge = 0;
    if (driverState) {
      driverCharge = driverState.price_per_day * days;
    }
    const taxes = 12.5;
    const totalAmount = rentalFee + driverCharge + taxes;
    const initialDeposit = Math.round(totalAmount * 0.25);

    return {
      days,
      rentalFee,
      driverCharge,
      taxes,
      totalAmount,
      initialDeposit,
    };
  }, [startDate, endDate, vehicle.price_per_day, driverState]);

  const toggleDriver = () => {
    if (driverState) {
      setDriverState(null);
    } else {
      setDriverState(driver);
    }
  };

  async function clientAction(formData: FormData) {
    const res = await createBookingAction(formData);

    if (res[1]) {
      toast.error(res[1].reason);
      return;
    }

    toast.success("Booking confirmed! Redirecting...");
    setTimeout(() => router.push("/profile"), 2000);
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

      <form
        action={clientAction}
        className="px-5 pt-24 space-y-6 max-w-md mx-auto"
      >
        <input type="hidden" name="vehicle_id" value={vehicle.id} />
        <input type="hidden" name="driver_id" value={driverState?.id || ""} />

        <BookingLocations
          pickup={pickup}
          setPickup={setPickup}
          dropoff={dropoff}
          setDropoff={setDropoff}
        />

        <BookingPeriod
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

        <BookingDriverToggle
          driver={driver}
          isActive={!!driverState}
          onToggle={toggleDriver}
        />

        <BookingCostSummary
          summary={costSummary}
          includeDriver={!!driverState}
        />

        <BookingSubmitButton />
      </form>
    </div>
  );
}
