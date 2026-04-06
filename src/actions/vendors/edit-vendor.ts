"use server";

import createAdminClient from "@/lib/supabase/clients/admin";
import { editVendorSchema } from "@/types/validation-schema";
import { revalidatePath, updateTag } from "next/cache";
import {
  ADMIN_CACHE_TAGS,
  VENDOR_CACHE_TAGS,
  USER_CACHE_TAGS,
} from "@/constants/cache-tags";
import authoriseAdmin from "@/service/admin/authorise";

export type EditVendorState = {
  success: boolean;
  error: string | null;
  message: string | null;
};

export default async function editVendorAction(
  vendorId: string,
  _prevState: EditVendorState,
  formData: FormData,
): Promise<EditVendorState> {
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

  const parsed = editVendorSchema.safeParse(raw);

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

  const authUpdates: Record<string, string> = {};
  if (email) authUpdates.email = email;
  if (password) authUpdates.password = password;

  if (Object.keys(authUpdates).length > 0) {
    const { error: authError } = await sb.auth.admin.updateUserById(
      vendorId,
      authUpdates,
    );

    if (authError) {
      return {
        success: false,
        error: authError.message || "Failed to update vendor authentication.",
        message: null,
      };
    }
  }

  const { error: profileError } = await sb
    .from("users")
    .update({
      name,
      email,
      mobile_no,
      date_of_birth,
      native_location,
      gender,
    })
    .eq("id", vendorId);

  if (profileError) {
    return {
      success: false,
      error: "Failed to update vendor profile.",
      message: null,
    };
  }

  updateTag(ADMIN_CACHE_TAGS.VENDORS_LIST);
  updateTag(ADMIN_CACHE_TAGS.VENDORS_STATS);
  updateTag(VENDOR_CACHE_TAGS.DASHBOARD_STATS);
  updateTag(USER_CACHE_TAGS.PROFILE);
  revalidatePath(`/dashboard/vendors/${vendorId}`);
  revalidatePath("/dashboard/vendors");

  return {
    success: true,
    error: null,
    message: `Vendor "${name}" has been updated successfully.`,
  };
}
