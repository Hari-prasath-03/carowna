import createAdminClient from "@/lib/supabase/clients/admin";

export async function createDummyUser() {
  const admin = createAdminClient();
  await admin.auth.admin.createUser({
    email: "carownarental@gmail.com",
    password: "123456",
    email_confirm: true,
    user_metadata: {
      name: "Carowna",
      role: "ADMIN",
    },
  });
}
