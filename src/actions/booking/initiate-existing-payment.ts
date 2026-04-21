"use server";

import Razorpay from "razorpay";
import { updateTag } from "next/cache";
import { err, ok } from "@/lib/error-handler";
import createClient from "@/lib/supabase/clients/server";
import { USER_CACHE_TAGS } from "@/constants/cache-tags";
import { getUser } from "@/service/self-user";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY!,
  key_secret:
    process.env.RAZORPAY_SECRET_KEY || process.env.RAZORPAY_SECERT_KEY!,
});

export default async function initiateExistingPaymentAction(bookingId: string) {
  const sb = await createClient();

  const [user, userErr] = await getUser();
  if (userErr || !user) {
    return err({ reason: "You must be logged in to pay" });
  }

  const { data: booking, error: fetchError } = await sb
    .from("bookings")
    .select(
      `
      id,
      initial_amount,
      booking_status,
      user_id,
      vehicle:vehicles(name)
    `,
    )
    .eq("id", bookingId)
    .single();

  if (fetchError || !booking) return err({ reason: "Booking not found" });

  if (booking.user_id !== user.id)
    return err({ reason: "Unauthorized access to this booking" });

  if (booking.booking_status !== "PENDING_PAYMENT")
    return err({ reason: "This booking is already processed or cancelled" });

  // Check if a successful payment already exists (ghost state)
  const { data: existingSuccess } = await sb
    .from("payments")
    .select("id")
    .eq("booking_id", bookingId)
    .eq("status", "SUCCESS")
    .maybeSingle();

  if (existingSuccess) {
    // If we found a success payment but the booking is still pending, fix it
    await sb
      .from("bookings")
      .update({ booking_status: "REQUESTED" })
      .eq("id", bookingId);

    updateTag(USER_CACHE_TAGS.BOOKINGS_HISTORY);
    return err({ reason: "Payment already successfully processed." });
  }

  try {
    const amountInPaise = Math.round(booking.initial_amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: booking.id,
    });

    // Use upsert to prevent duplication if a CREATED record already exists
    const { error: paymentUpsertError } = await sb.from("payments").upsert(
      {
        booking_id: booking.id,
        amount: booking.initial_amount,
        status: "CREATED",
        payment_method: "ONLINE",
        razorpay_order_id: order.id,
      },
      { onConflict: "booking_id, status" },
    );

    if (paymentUpsertError) {
      // Fallback to simple insert if unique constraint doesn't exist yet
      const { error: retryInsertError } = await sb.from("payments").insert({
        booking_id: booking.id,
        amount: booking.initial_amount,
        status: "CREATED",
        payment_method: "ONLINE",
        razorpay_order_id: order.id,
      });
      if (retryInsertError) throw retryInsertError;
    }

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_API_KEY;

    updateTag(USER_CACHE_TAGS.BOOKINGS_HISTORY);

    return ok({
      booking_id: booking.id,
      order_id: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      key_id,
      vehicle_name: Array.isArray(booking.vehicle)
        ? booking.vehicle[0]?.name
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (booking.vehicle as any)?.name,
      user_name: user.name,
      user_email: user.email,
    });
  } catch (error: unknown) {
    console.error("Razorpay order resumption failed:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Could not initiate payment. Please try again.";
    return err({ reason: errorMessage });
  }
}
