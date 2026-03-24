"use server";

import createAdminClient from "@/lib/supabase/clients/admin";
import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cache-tags";
import { err, ok } from "@/lib/error-handler";

export default async function approveVehicleAction(
  vehicleId: string,
  remarks?: string,
) {
  const { error } = await createAdminClient()
    .from("vehicles")
    .update({ approval_status: "APPROVED", approval_remarks: remarks ?? null })
    .eq("id", vehicleId);

  if (error) return err({ reason: error.message });

  updateTag(CACHE_TAGS.APPROVALS);
  updateTag(CACHE_TAGS.APPROVAL_STATS);
  updateTag(CACHE_TAGS.DASHBOARD_STATS);

  return ok({ message: "Vehicle approved successfully." });
}
