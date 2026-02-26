"use server";

import createClient from "@/lib/supabase/server";
import { signupSchema } from "@/types/validation-schema";
import { AuthActionState } from "@/types";

export default async function signupAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = signupSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      success: false,
      error: firstError.message,
      message: null,
    };
  }

  const { name, email, password } = parsed.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: "USER",
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
      message: null,
    };
  }

  return {
    success: true,
    error: null,
    message: "OTP sent to your email. Please verify to continue.",
  };
}
