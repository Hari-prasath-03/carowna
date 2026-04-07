import { err, ok } from "@/lib/error-handler";
import createClient from "@/lib/supabase/clients/server";
import { User } from "@/types";
import { cache } from "react";

function decodeJWTPayload(token: string) {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    return JSON.parse(Buffer.from(payloadPart, "base64").toString());
  } catch {
    return null;
  }
}

export const getUser = cache(async () => {
  const startTime = Date.now();
  const accessToken = await getAccessToken();

  if (!accessToken) return err({ reason: "Unauthorized" });

  const payload = decodeJWTPayload(accessToken);
  if (!payload || !payload.sub) return err({ reason: "Unauthorized" });

  const user: User = {
    id: payload.sub,
    email: payload.email,
    display_name: payload.user_metadata?.name || payload.email,
    role: payload.user_metadata?.role || "USER",
  };

  const totalTime = Date.now() - startTime;
  console.log(`User retreval time: ${totalTime}ms`);

  return ok(user);
});

export const getAccessToken = cache(async () => {
  const sb = await createClient();
  const {
    data: { session },
  } = await sb.auth.getSession();
  return session?.access_token || null;
});
