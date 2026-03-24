"use server";

import createServerClient from "@/lib/supabase/clients/server";
import { getUser } from "@/service/self-user";

export async function updateLastActiveAction() {
  const supabase = await createServerClient();

  const [user, error] = await getUser();
  if (error || !user) return;

  await supabase
    .from("users")
    .update({ last_active_at: new Date().toISOString() })
    .eq("id", user.id);
}
