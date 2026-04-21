"use client";

import {
  useActionState,
  useEffect,
  useState,
  useRef,
  useTransition,
} from "react";
import { uploadFile } from "@/lib/supabase/storage/upload-file";
import updateVehicleAction from "@/actions/vehicles/update-vehicle";
import addVehicleAction from "@/actions/vehicles/add-vehicle";
import updateVehicleAssetsAction from "@/actions/vehicles/update-vehicle-assets";
import cleanupVehicleImage from "@/actions/vehicles/cleanup-vehicle-assets";
import FormInput from "@/components/forms/form-input";
import FormSelect from "@/components/forms/form-select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, X, Plus, FileText, Upload, ExternalLink } from "lucide-react";
import { AddVehicleState, VendorVehicleDetails } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

type UnifiedImage =
  | { id: string; type: "existing"; url: string }
  | { id: string; type: "new"; file: File; preview: string };

type DocFiles = {
  insurance: File | null;
  rc: File | null;
  rto: File | null;
};

const initialState: AddVehicleState = {
  success: false,
  error: null,
  message: null,
};

interface VehicleFormProps {
  initialData?: VendorVehicleDetails;
}

export default function VehicleForm({ initialData }: VehicleFormProps) {
  const isEditing = !!initialData;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<UnifiedImage[]>(
    () =>
      initialData?.images?.map((url) => ({
        id: url,
        type: "existing",
        url,
      })) || [],
  );

  const [docFiles, setDocFiles] = useState<DocFiles>({
    insurance: null,
    rc: null,
    rto: null,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState<string>("");

  const boundAction = isEditing
    ? updateVehicleAction.bind(null, initialData.id)
    : addVehicleAction;

  const [isPendingInTransition, startTransition] = useTransition();

  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState,
  );

  const uploadImg = async (img: UnifiedImage, vehicleId: string) => {
    if (img.type === "existing") return img.url;
    const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const [url, err] = await uploadFile({
      file: img.file,
      bucket: "images",
      folder: `vehicles/${vehicleId}`,
      fileName,
    });
    if (err) throw new Error(`Upload failed: ${err.reason}`);
    return `${url}?v=${Date.now()}`;
  };

  const uploadDoc = async (
    file: File | null,
    name: string,
    vehicleId: string,
  ) => {
    if (!file) return null;
    const [url, err] = await uploadFile({
      file,
      bucket: "documents",
      folder: `vehicles/${vehicleId}`,
      fileName: name,
      upsert: true,
    });
    if (err) throw new Error(`${name} upload failed: ${err.reason}`);
    return url || null;
  };

  const detectChanges = () => {
    const imagesChanged =
      images.some((img) => img.type === "new") ||
      images.length !== (initialData?.images?.length ?? 0);

    const docsChanged = !!docFiles.insurance || !!docFiles.rc || !!docFiles.rto;

    return {
      imagesChanged,
      docsChanged,
      hasAnyChange: imagesChanged || docsChanged,
    };
  };

  const processUploadsIfAny = async (
    changes: ReturnType<typeof detectChanges>,
    vehicleId: string,
  ) => {
    const imagePromise = changes.imagesChanged
      ? Promise.all(images.map(async (img) => uploadImg(img, vehicleId)))
      : Promise.resolve(initialData?.images ?? []);

    const insurancePromise = !!docFiles.insurance
      ? uploadDoc(docFiles.insurance, "insurance", vehicleId)
      : Promise.resolve(initialData?.insurance_doc_url);

    const rcPromise = !!docFiles.rc
      ? uploadDoc(docFiles.rc, "rc", vehicleId)
      : Promise.resolve(initialData?.rc_doc_url);

    const rtoPromise = !!docFiles.rto
      ? uploadDoc(docFiles.rto, "rto", vehicleId)
      : Promise.resolve(initialData?.rto_verification_doc_url);

    const [uploadResults, insuranceUrl, rcUrl, rtoUrl] = await Promise.all([
      imagePromise,
      insurancePromise,
      rcPromise,
      rtoPromise,
    ]);

    return {
      images: uploadResults,
      docs: {
        insurance_doc_url: insuranceUrl ?? "",
        rc_doc_url: rcUrl ?? "",
        rto_verification_doc_url: rtoUrl ?? "",
      },
    };
  };

  const handlePostCreation = async (vehicleId: string) => {
    setIsProcessing(true);
    try {
      const changes = detectChanges();
      if (!changes.hasAnyChange) {
        toast.success("Vehicle updated");
        router.replace(`/vendor/vehicles/${vehicleId}`);
        return;
      }

      setProcessStatus("Uploading assets...");
      const uploads = await processUploadsIfAny(changes, vehicleId);

      setProcessStatus("Updating database...");
      const dbResult = await updateVehicleAssetsAction(
        vehicleId,
        uploads.images,
        uploads.docs,
      );

      if (!dbResult.success) throw Error(dbResult.error || "Upload failed");
      if (changes.imagesChanged) {
        setProcessStatus("Removing deleted images...");
        await cleanupVehicleImage(vehicleId, uploads.images.filter(Boolean));
      }

      toast.success(
        isEditing ? "Vehicle updated" : "Vehicle listed successfully",
      );
      router.replace(`/vendor/vehicles/${vehicleId}`);
    } catch (error) {
      console.error("Asset sync error:", error);
      toast.error("Failed to sync vehicle assets");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const newImages: UnifiedImage[] = files.map((file) => ({
      id: `new-${Date.now()}-${Math.random()}`,
      type: "new",
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img?.type === "new") URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
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
      <BasicInfoSection initialData={initialData} />

      <MediaDocsSection
        images={images}
        isProcessing={isProcessing}
        fileInputRef={fileInputRef}
        handleImageSelect={handleImageSelect}
        removeImage={removeImage}
        docFiles={docFiles}
        setDocFiles={setDocFiles}
        existingData={initialData}
      />

      <OperationalStatusSection initialData={initialData} />

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="rounded-xl px-10 h-11 font-bold transition-all text-xs uppercase tracking-widest"
        >
          Discard Changes
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
            "List Vehicle"
          )}
        </Button>
      </div>
    </form>
  );
}

function VehicleFormSection({
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

function BasicInfoSection({
  initialData,
}: {
  initialData?: VendorVehicleDetails;
}) {
  return (
    <VehicleFormSection
      title="Basic Information"
      description="Primary details and specifications"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Vehicle Name"
          name="name"
          placeholder="e.g. Tesla Model 3"
          defaultValue={initialData?.name ?? ""}
          required
        />
        <FormInput
          label="Brand"
          name="brand"
          placeholder="e.g. Tesla"
          defaultValue={initialData?.brand ?? ""}
          required
        />
        <FormSelect
          label="Vehicle Type"
          name="vehicle_type"
          placeholder="Select Type"
          options={[
            { label: "Car", value: "car" },
            { label: "Bike", value: "bike" },
          ]}
          defaultValue={initialData?.vehicle_type ?? ""}
        />
        <FormInput
          label="Registration Number"
          name="registration_number"
          placeholder="e.g. ABC-1234-XY"
          defaultValue={initialData?.registration_number ?? ""}
          required
        />
        <FormSelect
          label="Fuel Type"
          name="fuel_type"
          placeholder="Select Fuel"
          options={[
            { label: "Petrol", value: "petrol" },
            { label: "Diesel", value: "diesel" },
            { label: "Electric", value: "electric" },
            { label: "CNG", value: "cng" },
            { label: "Hybrid", value: "hybrid" },
          ]}
          defaultValue={initialData?.fuel_type ?? ""}
        />
        <FormInput
          label="Capacity (Persons)"
          name="capacity"
          type="number"
          placeholder="5"
          defaultValue={initialData?.capacity ?? ""}
          required
        />
        <FormSelect
          label="Transmission"
          name="transmission"
          placeholder="Select Transmission"
          options={[
            { label: "Manual", value: "manual" },
            { label: "Automatic", value: "automatic" },
          ]}
          defaultValue={initialData?.transmission ?? ""}
        />
        <FormInput
          label="Price Per Day (₹)"
          name="price_per_day"
          type="number"
          placeholder="0.00"
          defaultValue={initialData?.price_per_day ?? ""}
          required
        />
        <FormInput
          label="State"
          name="state"
          type="text"
          placeholder="e.g. Kerala"
          defaultValue={initialData?.state ?? ""}
          required
        />
        <FormInput
          label="District"
          name="district"
          type="text"
          placeholder="e.g. Ernakulam"
          defaultValue={initialData?.district ?? ""}
          required
        />
        <FormInput
          label="Color"
          name="color"
          type="text"
          placeholder="e.g. White"
          defaultValue={initialData?.color ?? ""}
        />
      </div>
    </VehicleFormSection>
  );
}

function MediaDocsSection({
  images,
  isProcessing,
  fileInputRef,
  handleImageSelect,
  removeImage,
  docFiles,
  setDocFiles,
  existingData,
}: {
  images: UnifiedImage[];
  isProcessing: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (id: string) => void;
  docFiles: DocFiles;
  setDocFiles: React.Dispatch<React.SetStateAction<DocFiles>>;
  existingData?: VendorVehicleDetails;
}) {
  return (
    <VehicleFormSection
      title="Documents & Media"
      description="Compliance and descriptive assets"
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <label className="text-sm font-bold text-foreground">
            Vehicle Images
          </label>
          <div className="flex flex-wrap gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className={cn(
                  "relative group size-24 rounded-xl overflow-hidden border shadow-sm",
                  img.type === "existing"
                    ? "border-border/50 bg-muted"
                    : "border-primary/20 bg-muted",
                )}
              >
                <Image
                  src={img.type === "existing" ? img.url : img.preview}
                  alt="Vehicle Image"
                  fill
                  className="object-cover"
                />
                {img.type === "new" && (
                  <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
                )}
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 size-5 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md scale-90"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className={cn(
                "size-24 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1 group",
                isProcessing && "opacity-50 cursor-not-allowed",
              )}
            >
              <Plus className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                Add
              </span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              multiple
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border/20 pt-6">
          {(
            [
              {
                label: "Insurance",
                key: "insurance",
                url: existingData?.insurance_doc_url,
              },
              {
                label: "RC Selection",
                key: "rc",
                url: existingData?.rc_doc_url,
              },
              {
                label: "RTO Verification",
                key: "rto",
                url: existingData?.rto_verification_doc_url,
              },
            ] as const
          ).map((doc) => (
            <DocUploadItem
              key={doc.key}
              label={doc.label}
              file={docFiles[doc.key]}
              setFile={(file) =>
                setDocFiles((prev) => ({ ...prev, [doc.key]: file }))
              }
              existingUrl={doc.url}
            />
          ))}
        </div>
      </div>
    </VehicleFormSection>
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
              {file
                ? file.name
                : existingUrl
                  ? "Update Document"
                  : "Select PDF"}
            </p>
            {existingUrl && !file && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(existingUrl, "_blank");
                }}
                className="cursor-pointer shrink-0 size-6 flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                title="View Existing Document"
              >
                <ExternalLink className="size-3" />
              </button>
            )}
          </div>
          <p className="text-[10px] font-medium text-muted-foreground mt-0.5">
            {file
              ? "New file ready"
              : existingUrl
                ? "Stored on server"
                : "No file chosen"}
          </p>
        </div>
        <input
          type="file"
          ref={inputRef}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept="application/pdf,image/*"
          className="hidden"
        />
      </div>
    </div>
  );
}

function OperationalStatusSection({
  initialData,
}: {
  initialData?: VendorVehicleDetails;
}) {
  return (
    <VehicleFormSection
      title="Operational Status"
      description="Readiness for public listing"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Current Availability"
          name="is_available"
          placeholder="Select Status"
          options={[
            { label: "Available", value: "true" },
            { label: "Maintenance / Offline", value: "false" },
          ]}
          defaultValue={initialData?.is_available ? "true" : "false"}
        />
        <FormSelect
          label="Luxury"
          name="is_luxury"
          placeholder="Select Luxury"
          options={[
            { label: "Luxury", value: "true" },
            { label: "Normal", value: "false" },
          ]}
          defaultValue={initialData?.is_luxury ? "true" : "false"}
        />
      </div>
    </VehicleFormSection>
  );
}
