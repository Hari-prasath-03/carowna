"use server";

import createClient from "@/lib/supabase/clients/server";
import { validateBookingConstraints } from "@/service/bookings";
import { getUser } from "@/service/self-user";
import { bookingSchema } from "@/types/validation-schema";
import { err, ok } from "@/lib/error-handler";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY!,
  key_secret:
    process.env.RAZORPAY_SECRET_KEY || process.env.RAZORPAY_SECERT_KEY!,
});

export default async function createBookingAction(formData: FormData) {
  const sb = await createClient();

  const data = {
    vehicle_id: formData.get("vehicle_id") as string,
    driver_id: (formData.get("driver_id") as string) || null,
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

  const [user, userErr] = await getUser();
  if (userErr || !user) {
    return err({ reason: "You must be logged in to book" });
  }

  const [, validationErr] = await validateBookingConstraints({
    vehicleId: data.vehicle_id,
    driverId: data.driver_id,
    startDate: data.start_date,
    endDate: data.end_date,
  });

  if (validationErr) {
    return err({ reason: validationErr.message || validationErr.reason });
  }

  const bookingData = validated.data;

  // 1. Create PENDING_PAYMENT booking
  const { data: booking, error: bookingError } = await sb
    .from("bookings")
    .insert({
      user_id: user.id,
      vehicle_id: bookingData.vehicle_id,
      driver_id: bookingData.driver_id,
      start_date: bookingData.start_date,
      end_date: bookingData.end_date,
      total_amount: bookingData.total_amount,
      initial_amount: bookingData.initial_amount,
      location_pickup: bookingData.location_pickup,
      location_drop: bookingData.location_drop,
      booking_status: "PENDING_PAYMENT",
    })
    .select()
    .single();

  if (bookingError) {
    return err({ reason: bookingError.message });
  }

  // 2. Create Razorpay Order
  try {
    const amountInPaise = Math.round(bookingData.initial_amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: booking.id,
    });

    // 3. Create initial payment record
    const { error: paymentInsertError } = await sb.from("payments").insert({
      booking_id: booking.id,
      amount: bookingData.initial_amount,
      status: "CREATED",
      payment_method: "ONLINE",
      razorpay_order_id: order.id,
    });

    if (paymentInsertError) {
      throw paymentInsertError;
    }

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_API_KEY;

    return ok({
      booking_id: booking.id,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id,
    });
  } catch (error: unknown) {
    console.error("Razorpay order creation failed:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Could not initiate payment. Please try again.";
    await sb.from("bookings").delete().eq("id", booking.id);
    return err({ reason: errorMessage });
  }
}
