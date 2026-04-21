"use server";

import createClient from "@/lib/supabase/clients/server";
import { revalidatePath } from "next/cache";
import { getUser } from "@/service/self-user";
import { ok, err } from "@/lib/error-handler";
import {
  deleteFileByUrl,
  isInStorageBucket,
} from "@/lib/supabase/storage/delete-file";

export default async function updateKYCDocumentAction(
  type: "aadhaar" | "license",
  docUrl: string,
  oldDocUrl?: string | null,
) {
  const [user, userErr] = await getUser();
  if (userErr) return err({ reason: "Unauthorized" });

  const sb = await createClient();
  const updateData: Record<string, string | null | undefined> = {
    updated_at: new Date().toISOString(),
  };

  if (type === "aadhaar") {
    updateData.aadhaar_doc_url = docUrl;
  } else {
    updateData.license_doc_url = docUrl;
  }

  const { error } = await sb.from("users").update(updateData).eq("id", user.id);

  if (error)
    return err({ reason: `Unable to update ${type} document`, ...error });

  if (oldDocUrl && oldDocUrl !== docUrl && isInStorageBucket(oldDocUrl)) {
    try {
      const bucket = oldDocUrl.includes("/profile_images/")
        ? "profile_images"
        : oldDocUrl.includes("/documents/")
          ? "documents"
          : "images";

      await deleteFileByUrl(oldDocUrl, bucket);
    } catch (e) {
      console.error("Failed to delete old KYC doc:", e);
    }
  }

  revalidatePath("/profile");
  return ok({ success: true });
}
