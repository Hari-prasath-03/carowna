import { Button } from "@/components/ui/button";
import { Driver } from "@/types";
import { DriverCard } from "./driver-card";

interface DriverSelectionStepProps {
  drivers: Driver[];
  onSelect: (id: string) => void;
  onBack: () => void;
  loading: boolean;
}

export function DriverSelectionStep({
  drivers,
  onSelect,
  onBack,
  loading,
}: DriverSelectionStepProps) {
  return (
    <div className="space-y-3 pt-2">
      <div className="max-h-[50vh] overflow-y-auto pr-1 -mr-1 space-y-3 no-scrollbar pb-4">
        {drivers.length > 0 ? (
          drivers.map((driver) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              onClick={onSelect}
              disabled={loading}
            />
          ))
        ) : (
          <div className="py-12 text-center space-y-3">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              No drivers available
            </p>
            <Button
              variant="link"
              onClick={onBack}
              className="text-xs font-black uppercase tracking-widest text-primary"
            >
              Go Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
