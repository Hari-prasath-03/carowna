import createClient from "@/lib/supabase/client";

export async function getClientSession() {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

export async function isClientAuthenticated() {
  const session = await getClientSession();
  return !!session;
}
