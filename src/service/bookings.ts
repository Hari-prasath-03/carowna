import createClient from "@/lib/supabase/clients/server";
import { getUserDetails } from "./user";
import { getUser } from "./self-user";
import { err, ok } from "@/lib/error-handler";

export async function isVehicleAvailable(
  vehicleId: string,
  startDate: string,
  endDate: string,
) {
  const sb = await createClient();

  const { data, error } = await sb
    .from("bookings")
    .select("id")
    .eq("vehicle_id", vehicleId)
    .neq("booking_status", "CANCELLED")
    .gte("end_date", startDate)
    .lte("start_date", endDate);

  if (error) {
    console.error("Availability check failed:", error);
    return false;
  }

  return data.length === 0;
}

export async function isDriverAvailable(
  driverId: string,
  startDate: string,
  endDate: string,
) {
  const sb = await createClient();

  const { data, error } = await sb
    .from("bookings")
    .select("id")
    .eq("driver_id", driverId)
    .neq("booking_status", "CANCELLED")
    .gte("end_date", startDate)
    .lte("start_date", endDate);

  if (error) {
    console.error("Driver availability check failed:", error);
    return false;
  }

  return data.length === 0;
}

export async function validateBookingConstraints({
  vehicleId,
  driverId,
  startDate,
  endDate,
}: {
  vehicleId: string;
  driverId?: string | null;
  startDate: string;
  endDate: string;
}) {
  const [user, userErr] = await getUser();
  if (userErr || !user) {
    return err({
      reason: "UNAUTHORIZED",
      message: "You must be logged in to book",
    });
  }

  const [userDetails, detailsErr] = await getUserDetails(user.id);
  if (detailsErr || !userDetails) {
    return err({
      reason: "USER_NOT_FOUND",
      message: "Could not verify user details",
    });
  }

  // Conditional KYC
  if (driverId) {
    // With Driver: Require Aadhaar
    if (!userDetails.aadhaar_verified) {
      return err({
        reason: "KYC_INCOMPLETE_AADHAAR",
        message: "Identification (Aadhaar) required for booking with a driver.",
      });
    }
  } else {
    // Self-Drive: Require License + Aadhaar
    if (!userDetails.license_verified || !userDetails.aadhaar_verified) {
      return err({
        reason: "KYC_INCOMPLETE_SELF_DRIVE",
        message: "Self-drive requires verified License & Aadhaar.",
      });
    }
  }

  // 2. Availability Check - Vehicle
  const vehicleAvailable = await isVehicleAvailable(
    vehicleId,
    startDate,
    endDate,
  );
  if (!vehicleAvailable) {
    return err({
      reason: "VEHICLE_UNAVAILABLE",
      message: "Vehicle is already booked for the selected dates.",
    });
  }

  // 3. Availability Check - Driver
  if (driverId) {
    const driverAvailable = await isDriverAvailable(
      driverId,
      startDate,
      endDate,
    );
    if (!driverAvailable) {
      return err({
        reason: "DRIVER_UNAVAILABLE",
        message: "The selected driver is already booked for these dates.",
      });
    }
  }

  return ok("Booking is valid");
}

export async function getBookingDetails(bookingId: string) {
  const sb = await createClient();

  const { data, error } = await sb
    .from("bookings")
    .select(
      `
      *,
      vehicle:vehicles(*),
      driver:drivers(*),
      payment:payments(*)
    `,
    )
    .eq("id", bookingId)
    .single();

  if (error) {
    console.error("Failed to fetch booking details:", error);
    return err({
      reason: "FETCH_FAILED",
      message: "Could not retrieve booking details.",
    });
  }

  return ok(data);
}

export async function getUserBookings(userId: string) {
  const sb = await createClient();

  const { data, error } = await sb
    .from("bookings")
    .select(
      `
      *,
      vehicle:vehicles(*)
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch user bookings:", error);
    return err({
      reason: "FETCH_FAILED",
      message: "Could not retrieve booking history.",
    });
  }

  return ok(data);
}
