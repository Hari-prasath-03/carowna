"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Phone, Mail, Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { uploadFile } from "@/lib/supabase/storage/upload-file";
import { updateProfileImageAction } from "@/actions/user/update-profile-image";
import { convertBlobUrlToFile } from "@/lib/utils";
import { ContactItem, DetailItem } from "./items";
import { Button } from "@/components/ui/button";
import {
  deleteFileByUrl,
  isInStorageBucket,
} from "@/lib/supabase/storage/delete-file";
import { EditProfileDrawer } from "./edit-profile-drawer";

interface UserInfoCardProps {
  userId: string;
  name: string;
  phone?: string;
  email: string;
  membership: string;
  since: string;
  avatarUrl?: string;
  date_of_birth?: string;
  native_location?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

export default function UserInfoCard({
  userId,
  name,
  phone,
  email,
  membership,
  since,
  avatarUrl: initialAvatarUrl,
  date_of_birth,
  native_location,
  gender,
}: UserInfoCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);

  const handleEditAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);

      const fileToUpload = await convertBlobUrlToFile(previewUrl);
      const [publicUrl, uploadErr] = await uploadFile({
        file: fileToUpload,
        bucket: "images",
        folder: `users/${userId}`,
        fileName: "profile",
        upsert: true,
      });

      if (uploadErr) {
        toast.error(uploadErr.reason);
        setAvatarUrl(initialAvatarUrl);
        return;
      }

      await updateProfileImageAction(publicUrl);
      setAvatarUrl(publicUrl);

      if (
        initialAvatarUrl &&
        initialAvatarUrl !== publicUrl &&
        isInStorageBucket(initialAvatarUrl)
      ) {
        const legacyBucket = initialAvatarUrl.includes("/profile_images/")
          ? "profile_images"
          : "images";
        await deleteFileByUrl(initialAvatarUrl, legacyBucket);
      }
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Something went wrong during upload");
      setAvatarUrl(initialAvatarUrl);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-primary-foreground rounded-3xl overflow-hidden border border-border shadow-sm">
      <div className="p-6 relative">
        <div className="flex justify-between items-start">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border/40 relative">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-foreground/40 text-3xl font-bold">
                  {name.charAt(0)}
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <Button
              size="icon"
              variant="secondary"
              disabled={isUploading}
              onClick={handleEditAvatarClick}
              className="absolute -top-1 -right-1 h-8 w-8 rounded-full shadow-md bg-primary-foreground border border-border hover:bg-muted"
            >
              <Edit2 className="h-4 w-4 text-foreground" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <EditProfileDrawer
            initialData={{
              name,
              mobile_no: phone,
              date_of_birth,
              native_location,
              gender,
            }}
          >
            <Button
              size="sm"
              variant="ghost"
              className="h-8 rounded-full px-3 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5"
            >
              Edit Profile
            </Button>
          </EditProfileDrawer>
        </div>

        <div className="mt-4 space-y-1">
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight leading-none">
            {name}
          </h2>
          <div className="space-y-2 pt-3">
            <ContactItem icon={Phone} value={phone} />
            <ContactItem icon={Mail} value={email} />
          </div>
        </div>
      </div>

      <div className="bg-muted/30 py-4 px-6 flex justify-between items-center border-t border-border/20">
        <DetailItem label="Membership" value={membership} />
        <DetailItem label="Since" value={since} align="right" />
      </div>
    </div>
  );
}
