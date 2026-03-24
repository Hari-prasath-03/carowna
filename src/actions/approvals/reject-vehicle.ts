import { CACHE_TAGS } from "@/constants/cache-tags";
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

  updateTag(CACHE_TAGS.APPROVALS);
  updateTag(CACHE_TAGS.APPROVAL_STATS);
  updateTag(CACHE_TAGS.DASHBOARD_STATS);

  return ok({ message: "Vehicle rejected." });
}
