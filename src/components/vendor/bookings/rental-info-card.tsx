import { VendorBookingDetails } from "@/types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { BadgeCheck, Calendar, Car, Clock, UserSquare2 } from "lucide-react";
import { format } from "date-fns";
import VendorCard from "../shared/vendor-card";

interface Props {
  booking: VendorBookingDetails;
}

export default function RentalInfoCard({ booking }: Props) {
  return (
    <VendorCard
      title="RENTAL ASSETS"
      icon={Car}
      className="h-full"
      bodyClassName="space-y-8 flex-1"
    >
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-muted border border-border/20 shadow-inner group">
          {booking.vehicle_images?.[0] ? (
            <Image
              src={booking.vehicle_images[0]}
              alt={booking.vehicle_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-muted-foreground/40 uppercase">
              No Img
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-foreground tracking-tighter uppercase leading-none">
            {booking.vehicle_name}
          </span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60 mt-1">
            {booking.vehicle_brand || "Standard Class"}
          </span>
          <Badge
            variant="outline"
            className="mt-2 w-fit text-[9px] font-black tracking-widest px-2 py-0.5 border-primary/20 text-primary"
          >
            {booking.registration_number}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 relative">
        {[
          { title: "PICKUP", date: booking.start_date, icon: Calendar },
          { title: "RETURN", date: booking.end_date, icon: Clock },
        ].map((item, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <item.icon className="size-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                {item.title}
              </span>
            </div>
            <span className="text-sm font-bold text-foreground">
              {format(new Date(item.date), "MMM dd, yyyy")}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/20">
        <div className="flex items-center gap-3">
          <UserSquare2 className="size-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
              DRIVER ASSIGNMENT
            </span>
            <span className="text-sm font-bold text-foreground">
              {booking.driver_name || "Self Drive Reservation"}
            </span>
          </div>
        </div>
        <BadgeCheck className="size-5 border-emerald-500/20 text-emerald-600 bg-emerald-500/5" />
      </div>
    </VendorCard>
  );
}
