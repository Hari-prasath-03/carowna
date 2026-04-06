"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getUser } from "@/service/self-user";
import createAdminClient from "@/lib/supabase/clients/admin";
import { DriverSchema } from "@/types/validation-schema";
import { VENDOR_CACHE_TAGS } from "@/constants/cache-tags";
import { AddDriverState } from "@/types";

export default async function addDriverAction(
  prevState: AddDriverState,
  formData: FormData,
): Promise<AddDriverState> {
  const [user] = await getUser();
  if (!user) redirect("/login");

  const rawData = {
    name: formData.get("name"),
    date_of_birth: formData.get("date_of_birth") || null,
    gender: formData.get("gender") || null,
    years_of_exp: formData.get("years_of_exp"),
    availability_status: formData.get("availability_status") === "true",
  };

  const validated = DriverSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0].message,
      message: null,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const sb = createAdminClient();
  const { data: driver, error } = await sb
    .from("drivers")
    .insert([
      {
        ...validated.data,
        vendor_id: user.id,
        approval_status: "PENDING",
      },
    ])
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message, message: null };
  }

  updateTag(VENDOR_CACHE_TAGS.DRIVERS_LIST);
  updateTag(VENDOR_CACHE_TAGS.DRIVER_STATS);

  return {
    success: true,
    error: null,
    message: "Driver listing initialized",
    id: driver.id,
  };
}
