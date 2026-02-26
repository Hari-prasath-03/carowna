"use server";

import { revalidatePath } from "next/cache";
import { ok, err } from "@/lib/error-handler";
import createClient from "@/lib/supabase/server";
import { bookingSchema } from "@/types/validation-schema";

export async function createBookingAction(formData: FormData) {
  const sb = await createClient();

  const data = {
    vehicle_id: formData.get("vehicle_id") as string,
    driver_id:
      formData.get("include_driver") === "true"
        ? (formData.get("driver_id") as string) || null
        : null,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    location_pickup: formData.get("location_pickup") as string,
    location_drop: formData.get("location_drop") as string,
    total_amount: Number(formData.get("total_amount")),
    initial_amount: Number(formData.get("initial_amount")),
  };

  const validated = bookingSchema.safeParse(data);
  if (!validated.success) {
    return err({
      reason: "Invalid booking data",
      errors: validated.error.flatten().fieldErrors,
    });
  }

  const { data: userData, error: userError } = await sb.auth.getUser();
  if (userError || !userData.user) {
    return err({ reason: "You must be logged in to book" });
  }

  const bookingData = validated.data;

  const { data: booking, error: bookingError } = await sb
    .from("bookings")
    .insert({
      user_id: userData.user.id,
      vehicle_id: bookingData.vehicle_id,
      driver_id: bookingData.driver_id,
      start_date: bookingData.start_date,
      end_date: bookingData.end_date,
      total_amount: bookingData.total_amount,
      initial_amount: bookingData.initial_amount,
      location_pickup: bookingData.location_pickup,
      location_drop: bookingData.location_drop,
      booking_status: "REQUESTED",
    })
    .select()
    .single();

  if (bookingError) {
    return err({ reason: bookingError.message });
  }

  const { error: paymentError } = await sb.from("payments").insert({
    booking_id: booking.id,
    amount: bookingData.initial_amount,
    status: "CREATED",
    payment_method: "ONLINE",
  });

  if (paymentError) {
    console.error("Payment record creation failed:", paymentError);
  }

  revalidatePath("/profile");

  return ok(booking);
}
