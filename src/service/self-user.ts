import { err, ok } from "@/lib/error-handler";
import createClient from "@/lib/supabase/clients/server";
import publicSupabase from "@/lib/supabase/clients/public";
import { User } from "@/types";
import { cache } from "react";
import { unstable_cache } from "next/cache";

const _getVerifiedUser = unstable_cache(
  async (accessToken: string) => {
    const {
      data: { user },
      error,
    } = await publicSupabase.auth.getUser(accessToken);
    if (error || !user) return null;

    return {
      id: user.id,
      email: user.email,
      display_name: user.user_metadata.display_name || user.user_metadata.name,
      role: user.user_metadata.role,
    } as User;
  },
  ["user-auth-verification"],
  { revalidate: 300, tags: ["auth"] },
);

export const getUser = cache(async () => {
  const [accessToken, error] = await getAccessToken();
  if (error) return err({ reason: error.reason });

  const user = await _getVerifiedUser(accessToken);
  if (!user) return err({ reason: "Unauthorized" });

  return ok(user);
});

export async function getAccessToken() {
  const sb = await createClient();

  const {
    data: { session },
    error: sessionError,
  } = await sb.auth.getSession();

  if (sessionError || !session?.access_token)
    return err({ reason: "Unauthorized" });

  return ok(session.access_token);
}
