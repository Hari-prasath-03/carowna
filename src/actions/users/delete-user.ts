"use server";

import createAdminClient from "@/lib/supabase/clients/admin";
import { updateTag } from "next/cache";
import { ADMIN_CACHE_TAGS, USER_CACHE_TAGS } from "@/constants/cache-tags";

export async function terminateUserAction(userId: string) {
  const sb = createAdminClient();
  const { error } = await sb.auth.admin.deleteUser(userId);

  if (error) {
    return {
      success: false,
      error: error.message || "Failed to terminate user.",
    };
  }

  updateTag(ADMIN_CACHE_TAGS.USERS_LIST);
  updateTag(ADMIN_CACHE_TAGS.USERS_STATS);
  updateTag(ADMIN_CACHE_TAGS.DASHBOARD_STATS);
  updateTag(USER_CACHE_TAGS.PROFILE);

  return {
    success: true,
    message: "User account has been permanently terminated.",
  };
}
