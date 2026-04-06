"use server";

import createAdminClient from "@/lib/supabase/clients/admin";
import { revalidatePath, updateTag } from "next/cache";
import {
  ADMIN_CACHE_TAGS,
  VENDOR_CACHE_TAGS,
  USER_CACHE_TAGS,
} from "@/constants/cache-tags";
import authoriseAdmin from "@/service/admin/authorise";

export type DeleteVendorState = {
  success: boolean;
  error: string | null;
  message: string | null;
};

export default async function deleteVendorAction(
  vendorId: string,
): Promise<DeleteVendorState> {
  const authorise = await authoriseAdmin();
  if (!authorise.success) return authorise;

  const sb = createAdminClient();
  const { error } = await sb.auth.admin.deleteUser(vendorId);

  if (error) {
    return {
      success: false,
      error: error.message || "Failed to delete vendor account.",
      message: null,
    };
  }

  updateTag(ADMIN_CACHE_TAGS.DASHBOARD_STATS);
  updateTag(ADMIN_CACHE_TAGS.VENDORS_LIST);
  updateTag(ADMIN_CACHE_TAGS.VENDORS_STATS);
  updateTag(USER_CACHE_TAGS.VEHICLES_LIST);
  updateTag(USER_CACHE_TAGS.PRICE_RANGE);
  updateTag(USER_CACHE_TAGS.PROFILE);
  updateTag(VENDOR_CACHE_TAGS.VEHICLES_LIST);
  updateTag(VENDOR_CACHE_TAGS.VEHICLE_STATS);
  revalidatePath("/dashboard/vendors");

  return {
    success: true,
    error: null,
    message: "Vendor has been successfully deleted.",
  };
}
