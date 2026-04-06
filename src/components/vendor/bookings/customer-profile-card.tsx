import { VendorBookingDetails } from "@/types";
import { BadgeCheck, Mail, Phone, User2 } from "lucide-react";
import VendorCard from "../shared/vendor-card";

interface Props {
  booking: VendorBookingDetails;
}

export default function CustomerProfileCard({ booking }: Props) {
  return (
    <VendorCard
      title="RENTER PROFILE"
      icon={User2}
      className="h-full"
      bodyClassName="space-y-8 flex-1"
    >
      <div className="flex items-center gap-2">
        <span className="text-xl font-black text-foreground tracking-tighter uppercase">
          {booking.user_name}
        </span>
        <BadgeCheck className="size-3.5 border-emerald-500/20 text-emerald-600 bg-emerald-500/5" />
      </div>

      <div className="space-y-6 pt-2">
        {[
          { title: "email address", value: booking.user_email, icon: Mail },
          { title: "phone number", value: booking.user_phone, icon: Phone },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 group">
            <div className="size-10 rounded-xl bg-muted/20 border border-border/20 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors group-hover:bg-muted/40">
              <item.icon className="size-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                {item.title}
              </span>
              <span className="text-sm font-bold text-foreground">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </VendorCard>
  );
}
