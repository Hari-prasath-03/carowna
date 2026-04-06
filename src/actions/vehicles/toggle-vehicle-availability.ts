"use server";

import createAdminClient from "@/lib/supabase/clients/admin";
import { updateTag } from "next/cache";
import {
  VENDOR_CACHE_TAGS,
  USER_CACHE_TAGS,
  ADMIN_CACHE_TAGS,
} from "@/constants/cache-tags";

export default async function toggleVehicleAvailability(
  vehicleId: string,
  isAvailable: boolean,
) {
  const sb = createAdminClient();

  const { error } = await sb
    .from("vehicles")
    .update({ is_available: isAvailable })
    .eq("id", vehicleId);

  if (error) {
    console.error("Error toggling vehicle availability:", error);
    return { error: error.message };
  }

  updateTag(VENDOR_CACHE_TAGS.VEHICLES_LIST);
  updateTag(VENDOR_CACHE_TAGS.VEHICLE_DETAILS);
  updateTag(VENDOR_CACHE_TAGS.VEHICLE_STATS);

  updateTag(USER_CACHE_TAGS.VEHICLES_LIST);
  updateTag(USER_CACHE_TAGS.VEHICLE_DETAILS);
  updateTag(USER_CACHE_TAGS.PRICE_RANGE);

  updateTag(ADMIN_CACHE_TAGS.VENDOR_VEHICLES);

  return { success: true };
}
