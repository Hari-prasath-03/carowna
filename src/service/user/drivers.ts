import { err, ok } from "@/lib/error-handler";
import publicSupabase from "@/lib/supabase/clients/public";
import { Driver } from "@/types";
import { unstable_cache } from "next/cache";
import { USER_CACHE_TAGS, CACHE_TIME } from "@/constants/cache-tags";

const _getDriversByVendor = unstable_cache(
  async (vendorId: string) => {
    const { data, error } = await publicSupabase
      .from("drivers")
      .select("id, vendor_id, name, years_of_exp, rating, price_per_day")
      .eq("vendor_id", vendorId)
      .eq("approval_status", "APPROVED");

    if (error) {
      return err({ reason: error.message });
    }

    const drivers: Driver[] = (data ?? []).map((d) => ({
      ...d,
      rating: Number(d.rating) || 4.5,
    }));

    return ok(drivers);
  },
  [USER_CACHE_TAGS.DRIVERS, "getDriversByVendor"],
  {
    revalidate: CACHE_TIME.RARE,
    tags: [USER_CACHE_TAGS.DRIVERS],
  },
);

export function getDriversByVendor(vendorId: string) {
  return _getDriversByVendor(vendorId);
}

const _getDriverById = unstable_cache(
  async (driverId: string) => {
    const { data, error } = await publicSupabase
      .from("drivers")
      .select("id, vendor_id, name, years_of_exp, rating, price_per_day")
      .eq("id", driverId)
      .maybeSingle();

    if (error || !data) {
      return err({ reason: "Driver not found" });
    }

    const driver: Driver = {
      ...data,
      rating: Number(data.rating) || 4.5,
    };

    return ok(driver);
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
