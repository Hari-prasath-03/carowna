"use server";

import { BasicDetailsState } from "@/types";
import { basicDetailsSchema } from "@/types/validation-schema";
import createClient from "@/lib/supabase/clients/server";
import { getUser } from "@/service/self-user";
import { revalidatePath } from "next/cache";

export async function updateBasicDetailsAction(
  _prevState: BasicDetailsState,
  formData: FormData,
): Promise<BasicDetailsState> {
  const [user, err] = await getUser();
  if (err) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const rawData = {
    name: formData.get("name"),
    mobile_no: formData.get("mobile_no"),
    date_of_birth: formData.get("date_of_birth"),
    native_location: formData.get("native_location"),
    gender: formData.get("gender"),
  };

  const validated = basicDetailsSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
    };
  }

  try {
    const sb = await createClient();
    const { error } = await sb
      .from("users")
      .update({
        name: validated.data.name,
        mobile_no: validated.data.mobile_no,
        date_of_birth: validated.data.date_of_birth,
        native_location: validated.data.native_location,
        gender: validated.data.gender,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    await sb.auth.updateUser({
      data: {
        name: validated.data.name,
      },
    });

    if (error) throw error;

    revalidatePath("/profile");
    return {
      success: true,
      message: "Profile updated successfully.",
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update details.";
    return {
      success: false,
      message,
    };
  }
}
