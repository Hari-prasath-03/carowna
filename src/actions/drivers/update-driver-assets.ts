"use server";

import { updateTag } from "next/cache";
import createAdminClient from "@/lib/supabase/clients/admin";
import { ADMIN_CACHE_TAGS } from "@/constants/cache-tags";

export default async function updateDriverAssetsAction(
  driverId: string,
  licenseUrl: string,
) {
  const sb = createAdminClient();
  const { error } = await sb
    .from("drivers")
    .update({ license_doc_url: licenseUrl, updated_at: new Date() })
    .eq("id", driverId);

  if (error) return { success: false, error: error.message };

  updateTag(ADMIN_CACHE_TAGS.DRIVERS_LIST);
  updateTag(ADMIN_CACHE_TAGS.DRIVER_DETAILS);

  return {
    success: true,
    id: driverId,
    error: null,
    message: "Assets updated",
  };
}
