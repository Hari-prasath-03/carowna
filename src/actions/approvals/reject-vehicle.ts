import {
  ADMIN_CACHE_TAGS,
  VENDOR_CACHE_TAGS,
  USER_CACHE_TAGS,
} from "@/constants/cache-tags";
import { err, ok } from "@/lib/error-handler";
import createAdminClient from "@/lib/supabase/clients/admin";
import { updateTag } from "next/cache";

export default async function rejectVehicleAction(
  vehicleId: string,
  remarks?: string,
) {
  const { error } = await createAdminClient()
    .from("vehicles")
    .update({ approval_status: "REJECTED", approval_remarks: remarks ?? null })
    .eq("id", vehicleId);

  if (error) return err({ reason: error.message });

  updateTag(ADMIN_CACHE_TAGS.APPROVALS_LIST);
  updateTag(ADMIN_CACHE_TAGS.APPROVALS_STATS);
  updateTag(ADMIN_CACHE_TAGS.DASHBOARD_STATS);
  updateTag(ADMIN_CACHE_TAGS.VENDOR_VEHICLES);

  updateTag(VENDOR_CACHE_TAGS.VEHICLES_LIST);
  updateTag(VENDOR_CACHE_TAGS.VEHICLE_STATS);
  updateTag(VENDOR_CACHE_TAGS.VEHICLE_DETAILS);

  updateTag(USER_CACHE_TAGS.VEHICLES_LIST);

  return ok({ message: "Vehicle rejected." });
}
