import createClient from "@/lib/supabase/server";
import { User } from "@/types";

export async function getUser(): Promise<User | undefined> {
  const sb = await createClient();
  const { data, error } = await sb.auth.getUser();
  if (error || !data.user) return undefined;

  return {
    id: data.user.id,
    email: data.user.email,
    display_name: data.user.user_metadata.display_name,
    role: data.user.user_metadata.role,
  } as User;
}

export async function getUserClaims() {
  const sb = await createClient();
  const { data, error } = await sb.auth.getSession();
  if (error || !data.session) return undefined;
  const { user } = data.session;

  return {
    id: user.id,
    email: user.email,
    display_name: user.user_metadata.display_name,
    role: user.user_metadata.role,
  } as User;
}
