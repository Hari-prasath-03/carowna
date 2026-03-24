import { err, ok } from "@/lib/error-handler";
import createClient from "@/lib/supabase/clients/server";
import publicSupabase from "@/lib/supabase/clients/public";
import { User } from "@/types";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TIME } from "@/constants/cache-tags";

const verifyToken = unstable_cache(
  async (token: string) => {
    const {
      data: { user },
      error,
    } = await publicSupabase.auth.getUser(token);
    if (error || !user) return null;
    return {
      id: user.id,
      email: user.email,
      display_name: user.user_metadata.name,
      role: user.user_metadata.role,
    } as User;
  },
  [CACHE_TAGS.AUTH],
  { revalidate: CACHE_TIME.FREQUENT, tags: [CACHE_TAGS.AUTH] },
);

export const getUser = cache(async () => {
  const accessToken = await getAccessToken();
  if (!accessToken) return err({ reason: "Unauthorized" });

  const user = await verifyToken(accessToken);
  if (!user) return err({ reason: "Unauthorized" });
  return ok(user);
});

export const getAccessToken = cache(async () => {
  const sb = await createClient();

  const {
    data: { session },
    error,
  } = await sb.auth.getSession();

  if (error || !session?.access_token) return null;
  return session.access_token;
});
