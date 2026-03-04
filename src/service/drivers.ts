import { err, ok } from "@/lib/error-handler";
import { publicSupabase } from "@/lib/supabase/clients/public";
import { Driver } from "@/types";
import { unstable_cache } from "next/cache";

export const getDriversByVendor = (vendorId: string) => {
  return unstable_cache(
    async () => {
      const sb = publicSupabase;
      const { data, error } = await sb
        .from("drivers")
        .select("id, vendor_id, name, years_of_exp, rating, price_per_day")
        .eq("vendor_id", vendorId)
        .eq("approval_status", "APPROVED");

      if (error) {
        return err({ reason: error.message });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const drivers: Driver[] = (data || []).map((d: any) => ({
        id: d.id,
        vendor_id: d.vendor_id,
        name: d.name,
        years_of_exp: d.years_of_exp,
        rating: Number(d.rating) || 4.5,
        price_per_day: d.price_per_day,
      }));

      return ok(drivers);
    },
    ["drivers-by-vendor", vendorId],
    {
      revalidate: 3600,
      tags: ["drivers", vendorId],
    },
  )();
};

export const getDriverById = (driverId: string) => {
  return unstable_cache(
    async () => {
      const sb = publicSupabase;
      const { data, error } = await sb
        .from("drivers")
        .select("id, vendor_id, name, years_of_exp, rating, price_per_day")
        .eq("id", driverId)
        .single();

      if (error) {
        return err({ reason: error.message });
      }

      const driver: Driver = {
        id: data.id,
        vendor_id: data.vendor_id,
        name: data.name,
        years_of_exp: data.years_of_exp,
        rating: Number(data.rating) || 4.5,
        price_per_day: data.price_per_day,
      };

      return ok(driver);
    },
    ["driver-by-id", driverId],
    {
      revalidate: 3600,
      tags: ["drivers", driverId],
    },
  )();
};
