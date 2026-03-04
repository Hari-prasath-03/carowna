"use server";

import createClient from "@/lib/supabase/clients/server";
import { revalidatePath } from "next/cache";
import { getUser } from "@/service/self-user";
import { ok, err } from "@/lib/error-handler";

export async function updateProfileImageAction(profileUrl: string) {
  const [user, userErr] = await getUser();
  if (userErr) return err({ reason: "Unauthorized" });

  const sb = await createClient();
  const { error } = await sb
    .from("users")
    .update({
      profile_url: profileUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return err({ reason: "Unable to update profile image", ...error });
  revalidatePath("/profile");
  return ok({ success: true });
}
