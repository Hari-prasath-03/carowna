import { NextResponse } from "next/server";
import crypto from "crypto";
import createClient from "@/lib/supabase/clients/server";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking_id,
    } = await req.json();

    // 1. Verify Signature
    const secret = process.env.RAZORPAY_SECERT_KEY!;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    // 2. Update Database
    const sb = await createClient();

    const { error: bookingError } = await sb
      .from("bookings")
      .update({ booking_status: "REQUESTED" })
      .eq("id", booking_id);

    if (bookingError) throw bookingError;

    const { error: paymentError } = await sb
      .from("payments")
      .update({
        status: "SUCCESS",
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
      })
      .eq("booking_id", booking_id)
      .eq("razorpay_order_id", razorpay_order_id);

    if (paymentError) throw paymentError;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Payment verification failed:", error);
    return NextResponse.json(
      { error: "Internal server error during verification" },
      { status: 500 },
    );
  }
}
