import { err, ok } from "@/lib/error-handler";
import { UserDetails, UserRole } from "@/types";
import { getUser } from "./self-user";
import { unstable_cache } from "next/cache";
import publicSupabase from "@/lib/supabase/clients/public";
import { CACHE_TAGS, CACHE_TIME } from "@/constants/cache-tags";

const _getUserDetails = unstable_cache(
  async (userId: string) => {
    const { data, error } = await publicSupabase
      .from("users")
      .select(
        `
        id,
        email,
        name,
        role,
        mobile_no,
        date_of_birth,
        native_location,
        gender,
        profile_url,
        license_doc_url,
        aadhaar_doc_url,
        license_verified,
        aadhaar_verified,
        created_at
      `,
      )
      .eq("id", userId)
      .single();

    if (error || !data) return err({ reason: "User not found" });

    return ok({
      id: data.id,
      email: data.email ?? "",
      display_name: data.name ?? "",
      role: (data.role as UserRole) ?? "USER",
      mobile_no: data.mobile_no,
      date_of_birth: data.date_of_birth,
      native_location: data.native_location,
      gender: data.gender,
      profile_url: data.profile_url,
      license_doc_url: data.license_doc_url,
      aadhaar_doc_url: data.aadhaar_doc_url,
      license_verified: data.license_verified,
      aadhaar_verified: data.aadhaar_verified,
      created_at: data.created_at,
    } as UserDetails);
  },
  [CACHE_TAGS.USER_PROFILE],
  {
    revalidate: CACHE_TIME.RARE,
    tags: [CACHE_TAGS.USER_PROFILE],
  },
);

export function getUserDetails(userId: string) {
  return _getUserDetails(userId);
}

export async function getUserLocation() {
  const [user, userErr] = await getUser();
  if (userErr) return ok("Location not updated");

  const [details, detailsErr] = await getUserDetails(user.id);
  if (detailsErr) return ok("Location not updated");

  return ok(details.native_location || "Location not updated");
}
