"use client";

import Link from "next/link";
import { Suspense, useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OtpInput from "@/components/forms/otp-input";
import { verifyOtpAction, resendOtpAction } from "@/actions/auth/otp-actions";
import Logo from "@/components/layout/logo";

const initialState = {
  success: false,
  error: null,
  message: null,
};

function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const otpCount = 6;
  const [otp, setOtp] = useState<string[]>(Array(otpCount).fill(""));
  const [resendCooldown, setResendCooldown] = useState(0);

  const [state, formAction, isPending] = useActionState(
    verifyOtpAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || "Email verified successfully!");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state.success, state.error, state.message]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    const result = await resendOtpAction(email);
    if (result.success) {
      toast.success(result.message || "New code sent to your email!");
      setResendCooldown(60);
    } else {
      toast.error(result.error);
    }
  };

  if (!email) {
    return (
      <div className="w-full space-y-6 text-center">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <h1 className="text-xl font-bold">Invalid Verification Link</h1>
        <p className="text-sm text-muted-foreground">
          Please sign up first to receive a verification code.
        </p>
        <Button asChild>
          <Link href="/signup">Go to Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-center">
      <div className="space-y-2">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
        <p className="text-sm text-muted-foreground">
          Enter the code sent to{" "}
          <span className="text-foreground font-medium">{email}</span>
        </p>
      </div>

      <Card className="border-border/50 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">One-Time Password</CardTitle>
          <CardDescription>
            Check your inbox for the verification code
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="token" value={otp.join("")} />

            {state.error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                {state.error}
              </div>
            )}

            <OtpInput
              value={otp}
              onChange={setOtp}
              disabled={isPending}
              count={otpCount}
            />

            <Button
              type="submit"
              className="w-full text-sm font-semibold"
              disabled={isPending || otp.join("").length !== otpCount}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend OTP"}
            </button>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Wrong email?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up again
        </Link>
      </p>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
