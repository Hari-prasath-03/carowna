"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import loginAction from "@/actions/auth/login";
import FormInput from "@/components/forms/form-input";
import { isClientAuthenticated } from "@/service/auth-client";
import { useRouter } from "next/navigation";
import Logo from "@/components/layout/logo";

const initialState = {
  success: false,
  error: null,
  message: null,
};

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  useEffect(() => {
    async function checkAuth() {
      if (await isClientAuthenticated()) router.push("/");
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) {
      const callbackUrl = new URLSearchParams(window.location.search).get("cb");
      router.push(callbackUrl || "/");
    }
  }, [state.error, state.success, router]);

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <Card className="border-border/50 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Sign In</CardTitle>
          <CardDescription>
            Use your email and password to log in
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-4">
            {state.error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                {state.error}
              </div>
            )}

            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              disabled={isPending}
            />

            <div className="space-y-1">
              <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                disabled={isPending}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium invisible">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full text-sm font-semibold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-primary font-medium hover:underline underline-offset-4 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
