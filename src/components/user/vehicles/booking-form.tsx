"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState, useMemo, useTransition } from "react";
import { useBookingValidation } from "@/hooks/use-booking-validation";
import { useRazorpay } from "@/hooks/use-razorpay";
import { Driver, AuthUser, Vehicle } from "@/types";
import { AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";

import createBookingAction from "@/actions/booking/create-booking";
import BookingLocations from "../booking/booking-locations";
import BookingPeriod from "../booking/booking-period";
import BookingDriverToggle from "../booking/booking-driver-toggle";
import BookingCostSummary from "../booking/booking-cost-summary";
import BookingSubmitButton from "../booking/booking-submit-button";

interface BookingFormProps {
  vehicle: Vehicle;
  driver: Driver | null;
  user: AuthUser;
}

export default function BookingForm({
  vehicle,
  driver: initialDriver,
  user,
}: BookingFormProps) {
  const [isPending, startTransition] = useTransition();

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [driverState, setDriverState] = useState(initialDriver);

  const { validationStatus } = useBookingValidation(
    vehicle.id,
    startDate,
    endDate,
    driverState?.id,
    startTransition,
  );

  const { openCheckout } = useRazorpay();

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
    if (driverState) setDriverState(null);
    else setDriverState(initialDriver);
  };

  async function clientAction(formData: FormData) {
    // validate booking constraints & create booking then create razorpay order and initial payment record
    const [booking, err] = await createBookingAction(formData);

    if (err) {
      toast.error(err.reason);
      return;
    }

    const { order_id, amount, currency, key_id, booking_id } = booking as {
      order_id: string;
      amount: number;
      currency: string;
      key_id: string;
      booking_id: string;
    };

    openCheckout({
      key_id,
      order_id,
      amount,
      currency,
      booking_id,
      vehicle_name: vehicle.name,
      user_name: user.name,
      user_email: user.email,
    });
  }

  const kycIncomplete =
    !validationStatus.isValid && validationStatus.reason?.startsWith("KYC_");

  const getButtonLabel = () => {
    if (validationStatus.isChecking || isPending)
      return "Checking Availability...";
    if (kycIncomplete) return "Complete KYC to Book";
    if (!validationStatus.isValid) return "Dates Unavailable";
    if (startDate > endDate) return "Start date must be before end date";
    return "Confirm & Pay";
  };

  return (
    <div className="px-5 pt-24 space-y-6 max-w-md mx-auto">
      {!validationStatus.isValid && !validationStatus.isChecking && (
        <div
          className={`p-4 rounded-3xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
            kycIncomplete
              ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
              : "bg-destructive/10 border-destructive/20 text-destructive"
          }`}
        >
          {kycIncomplete ? (
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="text-sm font-bold uppercase tracking-tight">
              {kycIncomplete ? "KYC Verification Needed" : "Booking Conflict"}
            </p>
            <p className="text-xs font-medium opacity-90 leading-relaxed">
              {validationStatus.message}
            </p>
            {kycIncomplete && (
              <Link
                href="/profile"
                className="text-xs font-black uppercase tracking-widest underline decoration-2 underline-offset-4 mt-2 inline-block hover:opacity-80 transition-opacity"
              >
                Go to Profile →
              </Link>
            )}
          </div>
        </div>
      )}

      {validationStatus.isValid &&
        startDate &&
        endDate &&
        !validationStatus.isChecking && (
          <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold uppercase tracking-tight">
                Available
              </p>
              <p className="text-xs font-medium opacity-90">
                This vehicle is ready for your selected dates.
              </p>
            </div>
          </div>
        )}

      <form action={clientAction} className="space-y-6">
        <input type="hidden" name="vehicle_id" value={vehicle.id} />
        <input type="hidden" name="driver_id" value={driverState?.id || ""} />
        <input
          type="hidden"
          name="total_amount"
          value={costSummary.totalAmount}
        />
        <input
          type="hidden"
          name="initial_amount"
          value={costSummary.initialDeposit}
        />

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
          driver={initialDriver}
          isActive={!!driverState}
          onToggle={toggleDriver}
        />

        <BookingCostSummary
          summary={costSummary}
          includeDriver={!!driverState}
        />

        <BookingSubmitButton
          disabled={
            !validationStatus.isValid ||
            validationStatus.isChecking ||
            !startDate ||
            !endDate ||
            startDate > endDate
          }
          label={getButtonLabel()}
        />
      </form>
    </div>
  );
}
