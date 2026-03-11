"use client";

import { LogOut, Trash2 } from "lucide-react";
import logoutAction from "@/actions/auth/logout";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center gap-4 p-4 text-destructive hover:bg-destructive/5 transition-colors rounded-t-2xl border-b border-border"
    >
      <LogOut className={cn("h-5 w-5", pending && "animate-pulse")} />
      <span className="text-sm font-bold uppercase tracking-wider">
        {pending ? "Logging out..." : "Logout"}
      </span>
    </button>
  );
}

export default function AccountActions() {
  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-border shadow-sm bg-muted/10">
      <form action={logoutAction}>
        <LogoutButton />
      </form>
      <button
        onClick={handleDeleteAccount}
        className="w-full flex items-center gap-4 p-4 text-destructive hover:bg-destructive/5 transition-colors rounded-b-2xl"
      >
        <Trash2 className="h-5 w-5" />
        <span className="text-sm font-bold uppercase tracking-wider">
          Delete Account
        </span>
      </button>
    </div>
  );
}
