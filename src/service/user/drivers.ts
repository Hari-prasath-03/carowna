import { err, ok } from "@/lib/error-handler";
import publicSupabase from "@/lib/supabase/clients/public";
import { unstable_cache } from "next/cache";
import { USER_CACHE_TAGS, CACHE_TIME } from "@/constants/cache-tags";

const _getDrivers = unstable_cache(
  async () => {
    const { data, error } = await publicSupabase
      .from("drivers")
      .select("*")
      .eq("is_available", true);

    if (error) {
      return err({ reason: error.message });
    }

    return ok(data);
  },
  [USER_CACHE_TAGS.DRIVERS],
  {
    revalidate: CACHE_TIME.RARE,
    tags: [USER_CACHE_TAGS.DRIVERS],
  },
);

export function getDrivers() {
  return _getDrivers();
}

const _getDriverById = unstable_cache(
  async (driverId: string) => {
    const { data, error } = await publicSupabase
      .from("drivers")
      .select("*")
      .eq("id", driverId)
      .maybeSingle();

    if (error || !data) {
      return err({ reason: "Driver not found" });
    }

    return ok(data);
  },
  [USER_CACHE_TAGS.DRIVERS, "getDriverById"],
  {
    revalidate: CACHE_TIME.RARE,
    tags: [USER_CACHE_TAGS.DRIVERS],
  },
);

export function getDriverById(driverId: string) {
  return _getDriverById(driverId);
}
