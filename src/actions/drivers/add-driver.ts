"use server";

import { updateTag } from "next/cache";
import createAdminClient from "@/lib/supabase/clients/admin";
import { DriverFormSchema } from "@/types/validation-schema";
import { ADMIN_CACHE_TAGS } from "@/constants/cache-tags";
import { AddDriverState } from "@/types";

export default async function addDriverAction(
  prevState: AddDriverState,
  formData: FormData,
): Promise<AddDriverState> {
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

  const now = new Date().toISOString();
  const sb = createAdminClient();
  const { data: driver, error } = await sb
    .from("drivers")
    .insert({
      ...validated.data,
      created_at: now,
      updated_at: now,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message, message: null };
  }

  updateTag(ADMIN_CACHE_TAGS.DRIVERS_LIST);
  updateTag(ADMIN_CACHE_TAGS.DRIVER_STATS);

  return {
    success: true,
    error: null,
    message: "Driver listing initialized",
    id: driver.id,
  };
}
