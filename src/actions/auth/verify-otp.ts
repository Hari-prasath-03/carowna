"use server";

import createClient from "@/lib/supabase/server";
import { verifyOtpSchema } from "@/types/validation-schema";
import { AuthActionState } from "@/types";
import { redirect } from "next/navigation";

export async function verifyOtpAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email") as string;
  const token = formData.get("token") as string;

  const parsed = verifyOtpSchema.safeParse({ email, token });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0].message,
      message: null,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.token,
    type: "signup",
  });

  if (error) {
    return {
      success: false,
      error: error.message,
      message: null,
    };
  }

  redirect("/basic-details");
}

export async function resendOtpAction(email: string): Promise<AuthActionState> {
  if (!email) {
    return { success: false, error: "Email is required", message: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) {
    return { success: false, error: error.message, message: null };
  }

  return { success: true, error: null, message: "OTP resent successfully!" };
}
