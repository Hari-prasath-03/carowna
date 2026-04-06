"use server";

import createAdminClient from "@/lib/supabase/clients/admin";
import { getUser } from "@/service/self-user";
import { redirect } from "next/navigation";

export default async function cleanupVehicleImage(
  vehicleId: string,
  activeUrls: string[],
) {
  const [user] = await getUser();
  if (!user) redirect("/login");
  const sb = createAdminClient();

  const getPathFromUrl = (url: string) => {
    const marker = "public/images/";
    const index = url.indexOf(marker);
    if (index === -1) return null;

    let path = url.substring(index + marker.length);
    const queryIndex = path.indexOf("?");
    if (queryIndex !== -1) path = path.substring(0, queryIndex);
    return path;
  };

  const activePaths = new Set(
    activeUrls
      .map((url) => getPathFromUrl(url))
      .filter((p): p is string => !!p),
  );

  const { data: imgResult } = await sb.storage
    .from("images")
    .list(`vehicles/${vehicleId}`);

  if (imgResult) {
    const orphaned = imgResult
      .map((f) => `vehicles/${vehicleId}/${f.name}`)
      .filter((p) => !activePaths.has(p));
    if (orphaned.length > 0) await sb.storage.from("images").remove(orphaned);
  }
}
