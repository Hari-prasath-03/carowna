"use server";

import createAdminClient from "@/lib/supabase/clients/admin";
import { updateTag } from "next/cache";
import { ADMIN_CACHE_TAGS } from "@/constants/cache-tags";

export default async function toggleDriverAvailability(
  driverId: string,
  isAvailable: boolean,
) {
  const sb = createAdminClient();

  const { error } = await sb
    .from("drivers")
    .update({ is_available: isAvailable, updated_at: new Date() })
    .eq("id", driverId);

  if (error) {
    console.error("Error toggling driver availability:", error);
    return { success: false, error: error.message };
  }

  updateTag(ADMIN_CACHE_TAGS.DRIVERS_LIST);
  updateTag(ADMIN_CACHE_TAGS.DRIVER_STATS);

  return { success: true };
}
