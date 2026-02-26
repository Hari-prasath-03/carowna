"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import signupAction from "@/actions/auth/sign-up";
import FormInput from "@/components/forms/form-input";
import Logo from "@/components/logo";
import { isClientAuthenticated } from "@/service/auth-client";

const initialState = {
  success: false,
  error: null,
  message: null,
};

export default function SignupPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState,
  );
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function checkAuth() {
      if (await isClientAuthenticated()) router.push("/");
    }
    checkAuth();

    if (state.success) {
      toast.success(state.message || "Verification code sent to your email!");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state.success, state.error, state.message, router, email]);

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join Carvona and get started with vehicle rentals
        </p>
      </div>

      <Card className="border-border/50 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Sign Up</CardTitle>
          <CardDescription>
            Fill in your details to create an account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-4">
            {state.error &&
              !state.error.includes("Password") &&
              !state.error.includes("Email") &&
              !state.error.includes("Name") && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                  {state.error}
                </div>
              )}

            <FormInput
              label="Full Name"
              name="name"
              placeholder="John Doe"
              required
              disabled={isPending}
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              disabled={isPending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              required
              disabled={isPending}
            />

            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              required
              disabled={isPending}
            />

            <Button
              type="submit"
              className="w-full text-sm font-semibold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline underline-offset-4 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
