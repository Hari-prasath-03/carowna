"use server";

import { redirect } from "next/navigation";
import createClient from "@/lib/supabase/server";
import { loginSchema } from "@/types/validation-schema";
import { AuthActionState } from "@/types";

export default async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email");
  const password = formData.get("password");

  const parsed = loginSchema.safeParse({ email, password });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0].message,
      message: null,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error?.status === 400) {
    redirect(`/verify-otp?email=${encodeURIComponent(parsed.data.email)}`);
  }

  if (error) {
    return {
      success: false,
      error: error.message,
      message: null,
    };
  }

  redirect("/");
}
