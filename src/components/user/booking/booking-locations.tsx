import { MapPin } from "lucide-react";
import FormInput from "@/components/forms/form-input";

interface BookingLocationsProps {
  pickup: string;
  setPickup: (val: string) => void;
  dropoff: string;
  setDropoff: (val: string) => void;
}

export default function BookingLocations({
  pickup,
  setPickup,
  dropoff,
  setDropoff,
}: BookingLocationsProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.15em]">
          Locations
        </h3>
      </div>

      <div className="bg-card rounded-3xl p-6 border border-border shadow-sm space-y-6 relative overflow-hidden">
        <div className="absolute left-[2.45rem] top-26 bottom-12 w-px border-l border-dashed border-border pointer-events-none" />

        <FormInput
          label="Pickup Location"
          name="location_pickup"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          icon={<MapPin className="h-4 w-4" />}
          placeholder="Enter pickup location"
          required
          className="bg-transparent border-0 shadow-none focus-visible:ring-0 text-sm font-bold py-6 pl-0"
          containerClassName="space-y-2"
          labelClassName="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1"
          inputContainerClassName="group flex items-center gap-2 rounded-2xl bg-muted/40 border border-border focus-within:border-primary transition-all"
        />

        <FormInput
          label="Drop-off Location"
          name="location_drop"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          icon={<MapPin className="h-4 w-4" />}
          placeholder="Enter drop-off location"
          required
          className="bg-transparent border-0 shadow-none focus-visible:ring-0 text-sm font-bold py-6 pl-0"
          containerClassName="space-y-2"
          labelClassName="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1"
          inputContainerClassName="group flex items-center gap-2 rounded-2xl bg-muted/40 border border-border focus-within:border-primary transition-all"
        />
      </div>
    </section>
  );
}
