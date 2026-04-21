"use client";

import { useActionState, useEffect } from "react";
import addVendorAction, { AddVendorState } from "@/actions/vendors/add-vendor";
import editVendorAction from "@/actions/vendors/edit-vendor";
import FormInput from "@/components/forms/form-input";
import FormSelect from "@/components/forms/form-select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { VendorProfile } from "@/types";

const initialState: AddVendorState = {
  success: false,
  error: null,
  message: null,
};

const GENDER_OPTIONS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

export default function AddVendorForm({
  initialData,
}: {
  initialData?: Partial<VendorProfile>;
}) {
  const isEditing = !!initialData;
  const boundAction = isEditing
    ? editVendorAction.bind(null, initialData.id!)
    : addVendorAction;

  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState,
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      setTimeout(() => {
        if (isEditing && initialData) {
          router.push(`/dashboard/vendors/${initialData.id}`);
        } else {
          router.push("/dashboard/vendors");
        }
      }, 500);
    }
    if (!state.success && state.error) {
      toast.error(state.error);
    }
  }, [state, router, isEditing, initialData]);

  return (
    <form action={formAction} className="space-y-8">
      <div className="bg-card rounded-2xl border border-border/40 shadow-sm p-8 space-y-6">
        <div>
          <h2 className="text-lg font-black tracking-tighter text-foreground">
            Personal Information
          </h2>
          <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mt-1">
            Basic details of the vendor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Full Name"
            name="name"
            placeholder="e.g. Arjun Sharma"
            defaultValue={initialData?.name ?? ""}
            required
          />
          <FormInput
            label="Mobile Number"
            name="mobile_no"
            placeholder="10-digit number"
            defaultValue={initialData?.mobile_no ?? ""}
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
            placeholder="Select gender"
            options={GENDER_OPTIONS}
            defaultValue={initialData?.gender ?? ""}
          />
          <FormInput
            label="Location / City"
            name="native_location"
            placeholder="e.g. Chennai, Tamil Nadu"
            defaultValue={initialData?.native_location ?? ""}
          />
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/40 shadow-sm p-8 space-y-6">
        <div>
          <h2 className="text-lg font-black tracking-tighter text-foreground">
            Account Credentials
          </h2>
          <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mt-1">
            Login details for the vendor portal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="vendor@example.com"
            defaultValue={initialData?.email ?? ""}
            required
          />
          <FormInput
            label={
              isEditing ? "New Password (Leave blank to keep)" : "Password"
            }
            name="password"
            type="password"
            placeholder="Min. 6 characters"
            required={!isEditing}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pb-8">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl px-8 py-5 font-bold"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-xl px-8 py-5 font-bold shadow-sm shadow-primary/20 min-w-36"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditing ? "Saving..." : "Adding..."}
            </span>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Add Vendor"
          )}
        </Button>
      </div>
    </form>
  );
}
