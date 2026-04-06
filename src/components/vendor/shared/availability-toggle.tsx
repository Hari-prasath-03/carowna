"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvailabilityToggleProps {
  id: string;
  initialAvailable: boolean;
  onToggle: (
    id: string,
    nextState: boolean,
  ) => Promise<{ success?: boolean; error?: string }>;
  disabled?: boolean;
  showLabel?: boolean;
}

export default function AvailabilityToggle({
  id,
  initialAvailable,
  onToggle,
  disabled,
  showLabel = true,
}: AvailabilityToggleProps) {
  const [isAvailable, setIsAvailable] = useState(initialAvailable);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    if (disabled || isPending) return;

    const nextState = !isAvailable;
    startTransition(async () => {
      const result = await onToggle(id, nextState);
      if (result.success) setIsAvailable(nextState);
    });
  };

  return (
    <div className="flex items-center gap-3">
      {showLabel && (
        <span
          className={cn(
            "text-[10px] font-black uppercase tracking-widest transition-colors min-w-12.5 text-right",
            isAvailable ? "text-emerald-500" : "text-muted-foreground",
          )}
        >
          {isAvailable ? "Online" : "Offline"}
        </span>
      )}

      <button
        onClick={handleToggle}
        disabled={disabled || isPending}
        className={cn(
          "cursor-pointer relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          isAvailable ? "bg-emerald-500" : "bg-muted-foreground/30",
        )}
      >
        <span
          className={cn(
            "pointer-events-none block size-4 rounded-full bg-background shadow-lg ring-0 transition-transform duration-300",
            isAvailable ? "translate-x-6" : "translate-x-1",
          )}
        />
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-3 animate-spin text-white/50" />
          </div>
        )}
      </button>
    </div>
  );
}
