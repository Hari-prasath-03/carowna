import { err, ok } from "@/lib/error-handler";
import createClient from "@/lib/supabase/clients/server";
import publicSupabase from "@/lib/supabase/clients/public";
import { User } from "@/types";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CACHE_TIME, USER_CACHE_TAGS } from "@/constants/cache-tags";

const _verifyTokenSecurely = unstable_cache(
  async (token: string) => {
    const {
      data: { user },
      error,
    } = await publicSupabase.auth.getUser(token);

    if (error || !user) return null;

    return {
      id: user.id,
      email: user.email,
      display_name: user.user_metadata?.name,
      role: user.user_metadata?.role,
    } as User;
  },
  [USER_CACHE_TAGS.AUTH_VERIFICATION],
  {
    revalidate: CACHE_TIME.FREQUENT,
    tags: [USER_CACHE_TAGS.AUTH_VERIFICATION],
  },
);

export const getUser = cache(async () => {
  const s = Date.now();
  const accessToken = await getAccessToken();
  if (!accessToken) return err({ reason: "Unauthorized" });

  const user = await _verifyTokenSecurely(accessToken);

  if (!user) return err({ reason: "Unauthorized" });
  console.log(`[AUTH] User: ${Date.now() - s}ms`);
  return ok(user);
});

export const getAccessToken = cache(async () => {
  const sb = await createClient();
  const {
    data: { session },
  } = await sb.auth.getSession();
  return session?.access_token || null;
});
