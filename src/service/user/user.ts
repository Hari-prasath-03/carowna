import { err, ok } from "@/lib/error-handler";
import { UserDetails, UserRole } from "@/types";
import { getUser } from "../self-user";
import { unstable_cache } from "next/cache";
import publicSupabase from "@/lib/supabase/clients/public";
import { USER_CACHE_TAGS, CACHE_TIME } from "@/constants/cache-tags";

const _getUserDetails = unstable_cache(
  async (userId: string) => {
    const { data, error } = await publicSupabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) return err({ reason: "User not found" });

    return ok({
      ...data,
      role: (data.role as UserRole) ?? "USER",
    } as UserDetails);
  },
  [USER_CACHE_TAGS.PROFILE],
  {
    revalidate: CACHE_TIME.RARE,
    tags: [USER_CACHE_TAGS.PROFILE],
  },
);

export function getUserDetails(userId: string) {
  return _getUserDetails(userId);
}

export async function getUserLocation() {
  const [user, userErr] = await getUser();
  if (userErr) return ok(null);

  const [details, detailsErr] = await getUserDetails(user.id);
  if (detailsErr) return ok("Location not updated");

  return ok(details.native_location || "Location not updated");
}
