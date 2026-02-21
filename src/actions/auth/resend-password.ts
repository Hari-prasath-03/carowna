"use server";

import createClient from "@/lib/supabase/server";
import { ResetPasswordState } from "@/types";
import { resetPasswordSchema } from "@/types/validation-schema";
import { redirect } from "next/navigation";

export default async function resetPasswordAction(
  prevState: ResetPasswordState | null,
  formData: FormData,
) {
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  const validation = resetPasswordSchema.safeParse({
    password,
    confirmPassword,
  });

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: validation.data.password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  await supabase.auth.signOut();

  redirect("/login");
}
