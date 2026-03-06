"use server";

import createClient from "@/lib/supabase/clients/server";
import { err, ok } from "@/lib/error-handler";
import { getUser } from "@/service/self-user";

export default async function cancelBookingAction(bookingId: string) {
  const sb = await createClient();
  const [user, userErr] = await getUser();

  if (userErr || !user) {
    return err({ reason: "Unauthorized" });
  }

  const { error } = await sb
    .from("bookings")
    .update({ booking_status: "CANCELLED" })
    .eq("id", bookingId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Cancellation failed:", error);
    return err({ reason: error.message });
  }

  return ok("Booking cancelled successfully");
}
