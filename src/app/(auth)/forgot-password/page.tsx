"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormInput from "@/components/forms/form-input";
import Logo from "@/components/Logo";
import requestPasswordResetAction from "@/actions/auth/request-reset-password";

const initialState = {
  success: false,
  message: undefined,
  errors: {},
};

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
    }
  }, [state.success, state.message]);

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Forgot password?</h1>
        <p className="text-sm text-muted-foreground text-pretty max-w-[320px] mx-auto">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      <Card className="border-border/50 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Reset Password</CardTitle>
          <CardDescription>
            Enter your email to receive a reset link
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-4">
            {state.message && (
              <div
                className={cn(
                  "p-3 rounded-lg border text-sm font-medium flex items-center gap-2",
                  state.success
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "bg-destructive/10 border-destructive/20 text-destructive",
                )}
              >
                {state.success ? <CheckCircle2 className="w-4 h-4" /> : null}
                {state.message}
              </div>
            )}

            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              disabled={isPending}
              error={state.errors?.email}
            />

            <Button
              type="submit"
              className="w-full text-sm font-semibold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors pt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to login
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
