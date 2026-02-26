"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { getClientSession } from "@/service/auth-client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormInput from "@/components/forms/form-input";
import Logo from "@/components/logo";
import resetPasswordAction from "@/actions/auth/resend-password";

const initialState = {
  success: false,
  message: undefined,
  errors: {},
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  useEffect(() => {
    async function verifyAuth() {
      const session = await getClientSession();

      if (!session) {
        toast.error(
          "Unauthorized access. Please use the link sent to your email.",
        );
        router.push("/login");
      } else {
        setVerifying(false);
      }
    }
    verifyAuth();
  }, [router]);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || "Password updated successfully!");
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state.success, state.message]);

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Verifying session...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Set new password</h1>
        <p className="text-sm text-muted-foreground text-pretty max-w-[320px] mx-auto">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      <Card className="border-border/50 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" />
            New Password
          </CardTitle>
          <CardDescription>
            Choose a strong password for your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-4">
            {state.message && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                {state.message}
              </div>
            )}

            <FormInput
              label="New Password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
              error={state.errors?.password}
            />

            <FormInput
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
              error={state.errors?.confirmPassword}
            />

            <Button
              type="submit"
              className="w-full text-sm font-semibold "
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
