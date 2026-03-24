"use server";

import createAdminClient from "@/lib/supabase/clients/admin";
import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/constants/cache-tags";

export async function terminateUserAction(userId: string) {
  const sb = createAdminClient();
  const { error } = await sb.auth.admin.deleteUser(userId);

  if (error) {
    return {
      success: false,
      error: error.message || "Failed to terminate user.",
    };
  }

  updateTag(CACHE_TAGS.USERS);
  updateTag(CACHE_TAGS.USERS_STATS);
  updateTag(CACHE_TAGS.DASHBOARD_STATS);

  return {
    success: true,
    message: "User account has been permanently terminated.",
  };
}
