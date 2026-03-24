import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BOOKING_STATUS_BADGE_STYLES,
  BOOKING_STATUS_STYLES,
} from "@/constants/shared-styles";

interface TripInfoProps {
  startDate: string;
  endDate: string;
  locationPickup: string;
  locationDrop: string;
  status: string;
}

export default function BookingTripInfo({
  startDate,
  endDate,
  locationPickup,
  locationDrop,
  status,
}: TripInfoProps) {
  return (
    <div className="bg-card border rounded-2xl p-6 md:p-8 flex flex-col gap-6 w-full shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight text-foreground">
          Trip Info
        </h2>
        <Badge
          variant="outline"
          className={cn(
            BOOKING_STATUS_BADGE_STYLES,
            BOOKING_STATUS_STYLES[status],
          )}
        >
          {status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          {[
            { title: "Start Date", value: startDate },
            { title: "End Date", value: endDate },
          ].map((item) => (
            <div className="flex flex-col gap-1.5" key={item.title}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {item.title}
              </p>
              <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{format(new Date(item.value), "MMMM d, yyyy")}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          {[
            { title: "Pickup", value: locationPickup },
            { title: "Drop", value: locationDrop },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {item.title}
              </p>
              <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="leading-snug capitalize">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
