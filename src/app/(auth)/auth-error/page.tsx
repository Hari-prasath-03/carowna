"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/components/Logo";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error =
    searchParams.get("error") || "An unexpected authentication error occurred.";

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-destructive">
          Authentication Error
        </h1>
        <p className="text-sm text-muted-foreground">
          We encountered a problem while trying to sign you in.
        </p>
      </div>

      <Card className="border-destructive/20 shadow-xl backdrop-blur-sm border-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Verification Failed
          </CardTitle>
          <CardDescription>
            The authentication link may have expired or is invalid
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/10">
            <p className="text-sm font-medium text-destructive/90 wrap-break-word italic">
              &quot;{error}&quot;
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full h-11 text-sm font-semibold">
              <Link href="/login">Try signing in again</Link>
            </Button>

            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors pt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to registration
            </Link>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground px-4">
        If you continue to have issues, please contact our support team.
      </p>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8 text-muted-foreground">
          Loading error details...
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
