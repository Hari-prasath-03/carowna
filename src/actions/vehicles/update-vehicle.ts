"use server";

import {
  VENDOR_CACHE_TAGS,
  USER_CACHE_TAGS,
  ADMIN_CACHE_TAGS,
} from "@/constants/cache-tags";
import createAdminClient from "@/lib/supabase/clients/admin";
import { getUser } from "@/service/self-user";
import { AddVehicleState } from "@/types";
import { VehicleFormSchema } from "@/types/validation-schema";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export default async function updateVehicleAction(
  vehicleId: string,
  prevState: AddVehicleState,
  formData: FormData,
): Promise<AddVehicleState> {
  const [user] = await getUser();
  if (!user) redirect("/login");

  const rawData = {
    name: formData.get("name"),
    brand: formData.get("brand"),
    vehicle_type: formData.get("vehicle_type"),
    transmission: formData.get("transmission"),
    is_luxury: formData.get("is_luxury") === "true",
    color: formData.get("color"),
    registration_number: formData.get("registration_number"),
    fuel_type: formData.get("fuel_type"),
    capacity: formData.get("capacity"),
    state: formData.get("state"),
    district: formData.get("district"),
    is_available: formData.get("is_available") === "true",
    price_per_day: formData.get("price_per_day"),
  };

  const validated = VehicleFormSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0].message,
      message: null,
    };
  }

  const sb = createAdminClient();
  const { error } = await sb
    .from("vehicles")
    .update({ ...validated.data, updated_at: new Date().toISOString() })
    .eq("id", vehicleId)
    .eq("vendor_id", user.id);

  if (error) {
    return { success: false, error: error.message, message: null };
  }

  updateTag(VENDOR_CACHE_TAGS.VEHICLES_LIST);
  updateTag(VENDOR_CACHE_TAGS.VEHICLE_DETAILS);
  updateTag(VENDOR_CACHE_TAGS.VEHICLE_STATS);

  updateTag(USER_CACHE_TAGS.VEHICLES_LIST);
  updateTag(USER_CACHE_TAGS.VEHICLE_DETAILS);
  updateTag(USER_CACHE_TAGS.PRICE_RANGE);

  updateTag(ADMIN_CACHE_TAGS.VENDOR_VEHICLES);

  return {
    success: true,
    error: null,
    message: "Vehicle data updated. Finalizing...",
    id: vehicleId,
  };
}
