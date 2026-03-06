import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Driver } from "@/types";

interface BookingDriverToggleProps {
  driver: Driver | null;
  isActive: boolean;
  onToggle: () => void;
}

export default function BookingDriverToggle({
  driver,
  isActive,
  onToggle,
}: BookingDriverToggleProps) {
  if (!driver) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between p-5 rounded-3xl bg-card border border-border shadow-sm text-left transition-all active:scale-[0.98] hover:border-muted-foreground/20"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
          <MapPin className="h-5 w-5 text-foreground/70" />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-bold text-foreground">
            Include Professional Driver
          </p>
          <p className="text-[10px] font-medium text-muted-foreground">
            +₹{driver.price_per_day.toFixed(2)} per day
          </p>
        </div>
      </div>
      <div
        className={cn(
          "h-7 w-12 rounded-full p-1 transition-colors duration-300",
          isActive ? "bg-primary" : "bg-muted",
        )}
      >
        <div
          className={cn(
            "h-5 w-5 rounded-full bg-primary-foreground shadow-sm transition-transform duration-300",
            isActive ? "translate-x-5" : "translate-x-0",
          )}
        />
      </div>
      <input
        type="hidden"
        name="include_driver"
        value={isActive ? "true" : "false"}
      />
    </button>
  );
}
