import imageCompression from "browser-image-compression";
import { err, ok } from "@/lib/error-handler";
import getStorage from ".";

interface UploadImageProps {
  file: File;
  bucket: string;
  fileName: string;
  folder: string;
  upsert?: boolean;
}

export async function uploadFile({
  file,
  bucket,
  folder,
  fileName,
  upsert = true,
}: UploadImageProps) {
  const originalFileName = file.name;
  const fileExtension = originalFileName.slice(
    originalFileName.lastIndexOf(".") + 1,
  );

  const finalFileName = `${fileName}.${fileExtension}`;
  const path = `${folder}/${finalFileName}`;

  if (file.type.startsWith("image/")) {
    try {
      file = await imageCompression(file, { maxSizeMB: 1 });
    } catch {
      // ignore
    }
  }

  const storage = getStorage();
  const { data, error } = await storage
    .from(bucket)
    .upload(path, file, { upsert });

  if (error) return err({ reason: "Unable to upload file", ...error });

  const { data: urlData } = storage.from(bucket).getPublicUrl(data.path);
  return ok(urlData.publicUrl);
}
