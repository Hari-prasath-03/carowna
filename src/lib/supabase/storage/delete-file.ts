import { err, ok } from "@/lib/error-handler";
import getStorage from ".";

export function isInStorageBucket(image: string) {
  return image.startsWith("https://gjynzncmriajmquhiuja.supabase.co");
}

function getPathFromPublicUrl(url: string, bucket: string) {
  try {
    const parts = url.split(`/public/${bucket}/`);
    if (parts.length < 2) return null;
    return parts[1];
  } catch {
    return null;
  }
}

interface DeleteFileProps {
  path: string;
  bucket: string;
}

async function deleteFile({ path, bucket }: DeleteFileProps) {
  const storage = getStorage();
  const { data, error } = await storage.from(bucket).remove([path]);

  if (error) {
    return err({
      reason: `Failed to delete file from ${bucket}`,
      ...error,
    });
  }

  return ok(data);
}

export async function deleteFileByUrl(url: string, bucket: string) {
  const path = getPathFromPublicUrl(url, bucket);
  if (!path) return err({ reason: "Could not parse path from URL" });
  return deleteFile({ path, bucket });
}
