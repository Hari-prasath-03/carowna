"use server";

import { redirect } from "next/navigation";
import createClient from "@/lib/supabase/clients/server";

export default async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
