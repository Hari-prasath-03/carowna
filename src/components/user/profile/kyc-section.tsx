"use client";

import { useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LucideIcon,
  CreditCard,
  Car,
  CheckCircle2,
  UploadCloud,
  Edit2,
  ExternalLinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { uploadFile } from "@/lib/supabase/storage/upload-file";
import updateKYCDocumentAction from "@/actions/user/update-kyc-document";
import { Button } from "@/components/ui/button";

interface KYCItemProps {
  userId: string;
  label: string;
  icon: LucideIcon;
  verified: boolean;
  docUrl?: string;
  type: "aadhaar" | "license";
}

function KYCItem({
  userId,
  label,
  icon: Icon,
  verified,
  docUrl,
  type,
}: KYCItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const [publicUrl, uploadErr] = await uploadFile({
        file,
        bucket: "documents",
        folder: `users/${userId}`,
        fileName: type,
        upsert: true,
      });

      if (uploadErr) {
        toast.error(uploadErr.reason);
        return;
      }

      const [, actionErr] = await updateKYCDocumentAction(
        type,
        publicUrl,
        docUrl,
      );

      if (actionErr) {
        toast.error(actionErr.reason);
        return;
      }

      toast.success(`${label} updated successfully!`);
    } catch (error) {
      console.error("KYC Upload failed", error);
      toast.error("Something went wrong during upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownload = () => {
    if (!docUrl) return;
    window.open(docUrl, "_blank");
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-primary-foreground border border-border shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-muted/40 flex items-center justify-center">
          <Icon className="h-6 w-6 text-foreground/80" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-foreground">{label}</p>
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                verified ? "bg-green-500" : "bg-yellow-500",
              )}
            />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {verified
                ? "Verified"
                : docUrl
                  ? "Pending Verification"
                  : "Missing Document"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        {isUploading ? (
          <Skeleton className="h-5 w-5 rounded-full" />
        ) : docUrl ? (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-muted text-foreground"
              onClick={handleDownload}
              title="Download Document"
            >
              <ExternalLinkIcon className="h-4.5 w-4.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-muted text-foreground"
              onClick={handleUploadClick}
              title="Edit Document"
            >
              <Edit2 className="h-4.5 w-4.5" />
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full px-4 h-9 font-bold text-[11px] uppercase tracking-wider gap-2 bg-primary hover:bg-muted"
            onClick={handleUploadClick}
          >
            <UploadCloud className="h-4 w-4" />
            Upload
          </Button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,application/pdf"
          className="hidden"
        />
        {verified && !isUploading && (
          <CheckCircle2 className="h-6 w-6 text-foreground ml-2" />
        )}
      </div>
    </div>
  );
}

interface KYCSectionProps {
  userId: string;
  aadhaar_verified: boolean;
  license_verified: boolean;
  aadhaar_doc_url: string;
  license_doc_url: string;
}

export default function KYCSection({
  userId,
  aadhaar_verified,
  license_verified,
  aadhaar_doc_url,
  license_doc_url,
}: KYCSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold text-foreground px-1">KYC Documents</h3>
      <div className="space-y-3">
        <KYCItem
          userId={userId}
          label="Aadhaar Card"
          icon={CreditCard}
          verified={aadhaar_verified}
          docUrl={aadhaar_doc_url}
          type="aadhaar"
        />
        <KYCItem
          userId={userId}
          label="Driving Licence"
          icon={Car}
          verified={license_verified}
          docUrl={license_doc_url}
          type="license"
        />
      </div>
    </section>
  );
}
