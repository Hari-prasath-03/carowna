import { err, ok } from "@/lib/error-handler";
import publicSupabase from "@/lib/supabase/clients/public";
import { Driver } from "@/types";
import { unstable_cache } from "next/cache";

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
  ["drivers-by-vendor"],
  {
    revalidate: 3600,
    tags: ["drivers"],
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
  ["driver-by-id"],
  {
    revalidate: 3600,
    tags: ["drivers"],
  },
);

export function getDriverById(driverId: string) {
  return _getDriverById(driverId);
}
