import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function convertBlobUrlToFile(blobUrl: string) {
  const res = await fetch(blobUrl);
  const blob = await res.blob();

  const mimeType = blob.type || "application/octet-stream";
  const fileName =
    Date.now().toString(36) + Math.random().toString(36).slice(2);

  return new File([blob], fileName, { type: mimeType });
}
