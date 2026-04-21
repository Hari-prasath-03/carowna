"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getUser } from "@/service/self-user";
import createAdminClient from "@/lib/supabase/clients/admin";
import { DriverFormSchema } from "@/types/validation-schema";
import { ADMIN_CACHE_TAGS } from "@/constants/cache-tags";
import { AddDriverState } from "@/types";

export default async function updateDriverAction(
  driverId: string,
  prevState: AddDriverState,
  formData: FormData,
): Promise<AddDriverState> {
  const [user] = await getUser();
  if (!user) redirect("/login");

  const rawData = {
    name: formData.get("name"),
    date_of_birth: formData.get("date_of_birth"),
    gender: formData.get("gender"),
    years_of_exp: formData.get("years_of_exp"),
    price_per_day: formData.get("price_per_day"),
    is_available: formData.get("is_available") === "true",
  };

  const validated = DriverFormSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0].message,
      message: null,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const sb = createAdminClient();
  const { error } = await sb
    .from("drivers")
    .update({ ...validated.data, updated_at: new Date().toISOString() })
    .eq("id", driverId);

  if (error) {
    return { success: false, error: error.message, message: null };
  }

  updateTag(ADMIN_CACHE_TAGS.DRIVERS_LIST);
  updateTag(ADMIN_CACHE_TAGS.DRIVER_STATS);
  updateTag(ADMIN_CACHE_TAGS.DRIVER_DETAILS);

  return {
    success: true,
    id: driverId,
    error: null,
    message: "Profile updated",
  };
}
