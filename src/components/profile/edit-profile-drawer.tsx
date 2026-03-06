"use client";

import * as React from "react";
import { useActionState } from "react";
import { X, Loader2, User, Phone, MapPin, Calendar, Users } from "lucide-react";
import { toast } from "sonner";
import updateBasicDetailsAction from "@/actions/user/basic-details";
import { BasicDetailsState } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import FormInput from "@/components/forms/form-input";
import FormSelect from "@/components/forms/form-select";
import { useGeolocation } from "@/hooks/use-geolocation";
import { LocateFixed } from "lucide-react";

interface EditProfileDrawerProps {
  children: React.ReactNode;
  initialData: {
    name: string;
    mobile_no?: string;
    date_of_birth?: string;
    native_location?: string;
    gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  };
}

const initialState: BasicDetailsState = {
  success: false,
};

export default function EditProfileDrawer({
  children,
  initialData,
}: EditProfileDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const [state, formAction, isPending] = useActionState(
    updateBasicDetailsAction,
    initialState,
  );

  const { location, isLocating, setLocation, fetchCurrentLocation } =
    useGeolocation(initialData.native_location);

  React.useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      setOpen(false);
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="max-w-lg mx-auto bg-background flex flex-col rounded-t-4xl max-h-[90vh] outline-none border-t border-border">
        <div className="px-6 pb-8 flex-1 overflow-y-auto no-scrollbar pt-2">
          <DrawerHeader className="px-0 mb-8 flex flex-row items-center justify-between">
            <DrawerTitle className="text-xl font-black text-foreground uppercase tracking-tight text-left">
              Edit Profile
            </DrawerTitle>
            <DrawerClose asChild>
              <button className="h-10 w-10 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors shrink-0">
                <X className="h-5 w-5" />
              </button>
            </DrawerClose>
          </DrawerHeader>

          <form action={formAction} className="space-y-6">
            <FormInput
              label="Full Name"
              name="name"
              defaultValue={initialData.name}
              placeholder="Enter your full name"
              icon={<User className="h-4 w-4" />}
              error={state.errors?.name}
              disabled={isPending}
              className="text-xs font-bold h-12 rounded-2xl bg-muted/30 border-border/40"
            />

            <FormInput
              label="Mobile Number"
              name="mobile_no"
              type="tel"
              defaultValue={initialData.mobile_no}
              placeholder="Enter mobile number"
              icon={<Phone className="h-4 w-4" />}
              error={state.errors?.mobile_no}
              disabled={isPending}
              className="text-xs font-bold h-12 rounded-2xl bg-muted/30 border-border/40"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                defaultValue={initialData.date_of_birth}
                icon={<Calendar className="h-4 w-4" />}
                error={state.errors?.date_of_birth}
                disabled={isPending}
                className="text-xs font-bold h-9 rounded-xl bg-muted/30 border-border/40"
              />

              <FormSelect
                label="Gender"
                name="gender"
                placeholder="Select gender"
                defaultValue={initialData.gender}
                icon={<Users className="h-4 w-4" />}
                error={state.errors?.gender}
                disabled={isPending}
                options={[
                  { label: "Male", value: "MALE" },
                  { label: "Female", value: "FEMALE" },
                  { label: "Other", value: "OTHER" },
                  { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" },
                ]}
              />
            </div>

            <FormInput
              label="Native Location"
              name="native_location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where are you from?"
              icon={<MapPin className="h-4 w-4" />}
              action={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary/70 hover:text-accent-foreground transition-all rounded-md"
                  onClick={fetchCurrentLocation}
                  disabled={isLocating || isPending}
                  title="Use current location"
                >
                  {isLocating ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <LocateFixed className="h-4 w-4" />
                  )}
                </Button>
              }
              error={state.errors?.native_location}
              disabled={isPending}
              className="text-xs font-bold h-12 rounded-2xl bg-muted/30 border-border/40"
            />

            <div className="pt-4 flex gap-3">
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-2xl h-12 font-bold uppercase tracking-wider text-[10px]"
                >
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] relative overflow-hidden"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
