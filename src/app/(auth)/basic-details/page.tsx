"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import {
  Loader2,
  MapPin,
  Phone,
  Calendar,
  ChevronRight,
  Users,
  LocateFixed,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

import updateBasicDetailsAction from "@/actions/user/basic-details";
import { useGeolocation } from "@/hooks/use-geolocation";
import { BasicDetailsState } from "@/types";
import FormInput from "@/components/forms/form-input";
import FormSelect from "@/components/forms/form-select";
import Logo from "@/components/layout/logo";

const initialState: BasicDetailsState = {
  success: false,
  message: undefined,
  errors: {},
};

export default function BasicDetailsPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateBasicDetailsAction,
    initialState,
  );

  const { location, isLocating, setLocation, fetchCurrentLocation } =
    useGeolocation();

  useEffect(() => {
    if (state.success) router.push("/");
    if (state.message && !state.success) toast.error(state.message);
  }, [state.message, state.success, router]);

  return (
    <div className="w-full max-w-lg mx-auto md:py-16 px-4 py-6">
      <div className="text-center space-y-3 mb-10 md:mb-12">
        <div className="inline-flex items-center justify-center mb-1">
          <Logo />
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground/90">
          Complete Your Profile
        </h1>
        <p className="text-muted-foreground text-sm md:text-[0.9375rem] max-w-md mx-auto text-balance font-medium leading-relaxed">
          Please provide a few essential details to personalize your experience
          on Carvona.
        </p>
      </div>

      <Card className="border-none shadow-none bg-transparent md:border md:border-border/40 md:shadow-md md:bg-background/95 md:rounded-lg overflow-hidden">
        <CardContent className="md:pt-8 px-1 md:px-8">
          <form action={formAction} className="space-y-6 md:space-y-7">
            <div className="space-y-2">
              <FormInput
                label="Full Name"
                name="name"
                placeholder="Enter your full name"
                icon={<User className="w-3.5 h-3.5" />}
                error={state.errors?.name}
                disabled={isPending}
                className="h-11 rounded-md border-border/50 focus:ring-1 focus:ring-primary/10 transition-all text-sm bg-muted/5 shadow-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <FormInput
                  label="Mobile Number"
                  name="mobile_no"
                  type="tel"
                  placeholder="eg: 9123456780"
                  icon={<Phone className="w-3.5 h-3.5" />}
                  error={state.errors?.mobile_no}
                  disabled={isPending}
                  className="h-11 rounded-md border-border/50 focus:ring-1 focus:ring-primary/10 transition-all text-sm bg-muted/5 shadow-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  icon={<Calendar className="w-3.5 h-3.5" />}
                  error={state.errors?.date_of_birth}
                  disabled={isPending}
                  className="h-11 rounded-md border-border/50 focus:ring-1 focus:ring-primary/10 transition-all text-sm bg-muted/5 shadow-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <FormInput
                label="Native Location"
                name="native_location"
                placeholder="City, State"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                icon={<MapPin className="w-3.5 h-3.5" />}
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
                className="h-11 rounded-md border-border/50 focus:ring-1 focus:ring-primary/10 transition-all text-sm bg-muted/5 shadow-none"
                required
              />
            </div>

            <FormSelect
              label="Gender"
              name="gender"
              placeholder="Select Gender"
              icon={<Users className="w-3.5 h-3.5" />}
              options={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Other", value: "Other" },
                { label: "Prefer not to say", value: "Prefer not to say" },
              ]}
              defaultValue=""
              error={state.errors?.gender}
              disabled={isPending}
            />

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-11 text-sm font-bold rounded-md shadow-sm hover:shadow transition-all active:scale-[0.99] group bg-primary hover:bg-primary/95 text-primary-foreground tracking-tight"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving Details...
                  </>
                ) : (
                  <>
                    Save & Continue
                    <ChevronRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-[0.8125rem] text-muted-foreground/60 mt-10 md:mt-12 max-w-60 mx-auto md:max-w-none font-medium leading-relaxed">
        Your information is securely stored to personalize your experience.
      </p>
    </div>
  );
}
