"use server";

import {
  VENDOR_CACHE_TAGS,
  USER_CACHE_TAGS,
  ADMIN_CACHE_TAGS,
} from "@/constants/cache-tags";
import createAdminClient from "@/lib/supabase/clients/admin";
import { getUser } from "@/service/self-user";
import { AddVehicleState } from "@/types";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export default async function updateVehicleAssetsAction(
  vehicleId: string,
  images: string[],
  docs: {
    insurance_doc_url?: string;
    rc_doc_url?: string;
    rto_verification_doc_url?: string;
  },
): Promise<AddVehicleState> {
  const [user] = await getUser();
  if (!user) redirect("/login");

  const sb = createAdminClient();
  const { error } = await sb
    .from("vehicles")
    .update({
      images,
      ...docs,
    })
    .eq("id", vehicleId)
    .eq("vendor_id", user.id);

  if (error) {
    return { success: false, error: error.message, message: null };
  }

  updateTag(VENDOR_CACHE_TAGS.VEHICLES_LIST);
  updateTag(VENDOR_CACHE_TAGS.VEHICLE_DETAILS);
  updateTag(USER_CACHE_TAGS.VEHICLES_LIST);
  updateTag(USER_CACHE_TAGS.VEHICLE_DETAILS);
  updateTag(ADMIN_CACHE_TAGS.VENDOR_VEHICLES);

  return {
    success: true,
    error: null,
    message: "Vehicle assets updated successfully.",
    id: vehicleId,
  };
}
