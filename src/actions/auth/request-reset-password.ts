"use server";

import createClient from "@/lib/supabase/clients/server";
import { ForgotPasswordState } from "@/types";
import { forgotPasswordSchema } from "@/types/validation-schema";
import { headers } from "next/headers";

export default async function requestPasswordResetAction(
  prevState: ForgotPasswordState | null,
  formData: FormData,
) {
  const email = formData.get("email");
  const validation = forgotPasswordSchema.safeParse({ email });

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(
    validation.data.email,
    {
      redirectTo: `${origin}/api/auth/callback?next=/reset-password`,
    },
  );

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Password reset link sent to your email within few minutes.",
  };
}
