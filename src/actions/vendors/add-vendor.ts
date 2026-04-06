"use server";

import createAdminClient from "@/lib/supabase/clients/admin";
import { addVendorSchema } from "@/types/validation-schema";
import { updateTag } from "next/cache";
import { ADMIN_CACHE_TAGS } from "@/constants/cache-tags";
import authoriseAdmin from "@/service/admin/authorise";

export type AddVendorState = {
  success: boolean;
  error: string | null;
  message: string | null;
};

export default async function addVendorAction(
  _prevState: AddVendorState,
  formData: FormData,
): Promise<AddVendorState> {
  const authorise = await authoriseAdmin();
  if (!authorise.success) return authorise;

  const raw = {
    name: formData.get("name") || undefined,
    email: formData.get("email") || undefined,
    password: formData.get("password") || undefined,
    mobile_no: formData.get("mobile_no") || undefined,
    date_of_birth: formData.get("date_of_birth") || undefined,
    native_location: formData.get("native_location") || undefined,
    gender: formData.get("gender") || undefined,
  };

  const parsed = addVendorSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0].message,
      message: null,
    };
  }

  const {
    name,
    email,
    password,
    mobile_no,
    date_of_birth,
    native_location,
    gender,
  } = parsed.data;

  const sb = createAdminClient();

  const { data: authData, error: authError } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      role: "VENDOR",
    },
  });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message ?? "Failed to create vendor account",
      message: null,
    };
  }

  const { error: profileError } = await sb
    .from("users")
    .update({
      name,
      mobile_no,
      date_of_birth,
      native_location,
      gender,
      role: "VENDOR",
    })
    .eq("id", authData.user.id);

  if (profileError) {
    await sb.auth.admin.deleteUser(authData.user.id);
    return {
      success: false,
      error: "Failed to save vendor profile. Please try again.",
      message: null,
    };
  }

  updateTag(ADMIN_CACHE_TAGS.DASHBOARD_STATS);
  updateTag(ADMIN_CACHE_TAGS.VENDORS_LIST);
  updateTag(ADMIN_CACHE_TAGS.VENDORS_STATS);

  return {
    success: true,
    error: null,
    message: `Vendor "${name}" has been added successfully.`,
  };
}
