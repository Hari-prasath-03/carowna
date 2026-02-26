import { User, Star, Briefcase } from "lucide-react";
import { Driver } from "@/types";

interface DriverCardProps {
  driver: Driver;
  onClick: (id: string) => void;
  disabled?: boolean;
}

export function DriverCard({ driver, onClick, disabled }: DriverCardProps) {
  return (
    <button
      onClick={() => onClick(driver.id)}
      disabled={disabled}
      className="w-full flex items-center justify-between p-4 rounded-3xl bg-card border border-border shadow-sm transition-all hover:bg-muted/50 active:scale-[0.96] group"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-muted/60 flex items-center justify-center">
          <User className="h-5 w-5 text-foreground/60" />
        </div>
        <div className="text-left">
          <p className="font-bold text-sm uppercase tracking-tight">
            {driver.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 border-none" />
              <span className="text-[10px] font-black">
                {driver.rating.toFixed(1)}
              </span>
            </div>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <div className="flex items-center gap-1">
              <Briefcase className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground">
                {driver.years_of_exp}y Exp
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-right flex flex-col items-end gap-0.5">
        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
          Per Day
        </span>
        <p className="text-sm font-black text-primary tabular-nums">
          ₹{driver.price_per_day.toFixed(2)}
        </p>
      </div>
    </button>
  );
}
