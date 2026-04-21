"use client";

import {
  useActionState,
  useEffect,
  useState,
  useRef,
  useTransition,
} from "react";
import { uploadFile } from "@/lib/supabase/storage/upload-file";
import addDriverAction from "@/actions/drivers/add-driver";
import updateDriverAction from "@/actions/drivers/update-driver";
import updateDriverAssetsAction from "@/actions/drivers/update-driver-assets";
import FormInput from "@/components/forms/form-input";
import FormSelect from "@/components/forms/form-select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, FileText, Upload, ExternalLink } from "lucide-react";
import { AddDriverState, SystemDriverDetails } from "@/types";
import { cn } from "@/lib/utils";

const initialState: AddDriverState = {
  success: false,
  error: null,
  message: null,
};

interface DriverFormProps {
  initialData?: SystemDriverDetails;
}

export default function DriverForm({ initialData }: DriverFormProps) {
  const isEditing = !!initialData;
  const router = useRouter();

  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState<string>("");

  const boundAction = isEditing
    ? updateDriverAction.bind(null, initialData.id)
    : addDriverAction;

  const [isPendingInTransition, startTransition] = useTransition();
  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState,
  );

  const uploadDoc = async (file: File | null, driverId: string) => {
    if (!file) return null;
    const [url, err] = await uploadFile({
      file,
      bucket: "documents",
      folder: `drivers/${driverId}`,
      fileName: "license",
      upsert: true,
    });
    if (err) throw new Error(`License upload failed: ${err.reason}`);
    return url || null;
  };

  const handlePostCreation = async (driverId: string) => {
    setIsProcessing(true);
    try {
      if (!licenseFile) {
        toast.success(
          isEditing ? "Driver profile updated" : "Driver added successfully",
        );
        router.replace(`/dashboard/drivers/${driverId}`);
        return;
      }

      setProcessStatus("Uploading license...");
      const licenseUrl = await uploadDoc(licenseFile, driverId);

      if (licenseUrl) {
        setProcessStatus("Updating database...");
        await updateDriverAssetsAction(driverId, licenseUrl);
      }

      toast.success(
        isEditing ? "Driver profile updated" : "Driver added successfully",
      );
      router.replace(`/dashboard/drivers/${driverId}`);
    } catch (error) {
      console.error("Asset sync error:", error);
      toast.error("Failed to sync driver documents");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessStatus("Saving details...");

    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  };

  const isActuallyPending = isPending || isPendingInTransition || isProcessing;

  useEffect(() => {
    if (state.success && state.id) handlePostCreation(state.id);
    if (!state.success && state.error) {
      toast.error(state.error);
      setIsProcessing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 pb-20">
      <DriverFormSection
        title="Basic Information"
        description="Driver profile and professional experience"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Full Name"
            name="name"
            placeholder="e.g. Rajesh Kumar"
            defaultValue={initialData?.name ?? ""}
            required
          />
          <FormInput
            label="Years of Experience"
            name="years_of_exp"
            type="number"
            placeholder="e.g. 5"
            defaultValue={initialData?.years_of_exp ?? ""}
            required
          />
          <FormInput
            label="Date of Birth"
            name="date_of_birth"
            type="date"
            defaultValue={initialData?.date_of_birth ?? ""}
          />
          <FormSelect
            label="Gender"
            name="gender"
            placeholder="Select Gender"
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Others" },
            ]}
            defaultValue={initialData?.gender ?? ""}
          />
          <FormInput
            label="Price Per Day"
            name="price_per_day"
            type="number"
            placeholder="e.g. 1500"
            defaultValue={initialData?.price_per_day ?? ""}
            required
          />
        </div>
      </DriverFormSection>

      <DriverFormSection
        title="Professional Documents"
        description="Compliance and licensing documentation"
      >
        <div className="max-w-md">
          <DocUploadItem
            label="Driver's License (PDF)"
            file={licenseFile}
            setFile={setLicenseFile}
            existingUrl={initialData?.license_doc_url}
          />
        </div>
      </DriverFormSection>

      <DriverFormSection
        title="Operational Status"
        description="Active availability in listing"
      >
        <div className="space-y-4 max-w-sm">
          <FormSelect
            label="Availability"
            name="availability_status"
            placeholder="Select Status"
            options={[
              { label: "Available", value: "true" },
              { label: "Offline", value: "false" },
            ]}
            defaultValue={initialData?.is_available ? "true" : "false"}
          />
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider leading-relaxed px-1">
            Drivers must be APPROVED by the admin before they can accept
            bookings, regardless of their online status.
          </p>
        </div>
      </DriverFormSection>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="rounded-xl px-10 h-11 font-bold transition-all text-xs uppercase tracking-widest"
        >
          Discard
        </Button>
        <Button
          type="submit"
          disabled={isActuallyPending}
          className="rounded-xl px-12 h-11 font-bold shadow-sm shadow-primary/10 transition-all text-xs uppercase tracking-widest min-w-40"
        >
          {isActuallyPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              {processStatus}
            </span>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "List Driver"
          )}
        </Button>
      </div>
    </form>
  );
}

function DriverFormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border/40 shadow-sm p-8 space-y-6",
        className,
      )}
    >
      <div>
        <h2 className="text-lg font-black tracking-tighter text-foreground">
          {title}
        </h2>
        <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mt-1">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

function DocUploadItem({
  label,
  file,
  setFile,
  existingUrl,
}: {
  label: string;
  file: File | null;
  setFile: (file: File | null) => void;
  existingUrl?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
        {label}
      </p>
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl border border-dashed border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group",
          (file || existingUrl) && "border-primary/20 bg-primary/2",
        )}
      >
        <div className="size-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          {file || existingUrl ? (
            <FileText className="size-5 text-primary" />
          ) : (
            <Upload className="size-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1.5 overflow-hidden">
            <p className="text-xs font-bold text-foreground truncate max-w-full">
              {file ? file.name : existingUrl ? "Update License" : "Select PDF"}
            </p>
            {existingUrl && !file && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(existingUrl, "_blank");
                }}
                className="cursor-pointer shrink-0 size-6 flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                title="View Current License"
              >
                <ExternalLink className="size-3" />
              </button>
            )}
          </div>
          <p className="text-[10px] font-medium text-muted-foreground mt-0.5">
            {file
              ? "New file ready"
              : existingUrl
                ? "Stored on cloud"
                : "No document chosen"}
          </p>
        </div>
        <input
          type="file"
          ref={inputRef}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept="application/pdf"
          className="hidden"
        />
      </div>
    </div>
  );
}
