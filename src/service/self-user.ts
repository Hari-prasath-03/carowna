import { err, ok } from "@/lib/error-handler";
import createClient from "@/lib/supabase/clients/server";
import { User } from "@/types";

export async function getUser() {
  const sb = await createClient();
  const { data, error } = await sb.auth.getUser();
  if (error || !data.user) return err({ reason: "Unuthorised" });

  return ok({
    id: data.user.id,
    email: data.user.email,
    display_name: data.user.user_metadata.name,
    role: data.user.user_metadata.role,
  } as User);
}

export async function getUserClaims() {
  const sb = await createClient();
  const { data, error } = await sb.auth.getSession();
  if (error || !data.session) return err({ reason: "Unuthorised" });
  const { user } = data.session;

  return ok({
    id: user.id,
    email: user.email,
    display_name: user.user_metadata.name,
    role: user.user_metadata.role,
  } as User);
}
