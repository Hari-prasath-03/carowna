import Link from "next/link";
import { User, Car, Contact, ExternalLink } from "lucide-react";
import Image from "next/image";

interface AssetProps {
  userId: string;
  vehicleId: string;
  driverId?: string | null;
  customerProfileUrl?: string | null;
}

export default function BookingLinkedAssets({
  userId,
  vehicleId,
  driverId,
  customerProfileUrl,
}: AssetProps) {
  return (
    <div className="bg-card w-full border rounded-2xl p-6 md:p-8 flex flex-col shadow-sm h-full">
      <h2 className="text-xl font-black tracking-tight text-foreground mb-6">
        Linked Assets
      </h2>

      <div className="flex flex-col gap-4 flex-1">
        <Link href={`/dashboard/users/${userId}`} className="group block">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-transparent hover:border-border transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary">
                {customerProfileUrl ? (
                  <Image
                    src={customerProfileUrl}
                    alt="Customer"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div className="flex flex-col">
                <p className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                  CUSTOMER ID
                </p>
                <p className="text-sm font-bold text-foreground truncate">
                  {userId.slice(0, 12).toUpperCase()}...
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </Link>

        <InfoCard
          title="VEHICLE ID"
          value={vehicleId.slice(0, 12).toUpperCase() + "..."}
          icon={<Car className="w-5 h-5" />}
        />

        {driverId && (
          <InfoCard
            title="DRIVER ID"
            value={driverId.slice(0, 12).toUpperCase() + "..."}
            icon={<Contact className="w-5 h-5" />}
          />
        )}
      </div>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const InfoCard = ({ title, value, icon }: InfoCardProps) => {
  return (
    <div className="group block">
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-transparent">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary">
            {icon}
          </div>
          <div className="flex flex-col">
            <p className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
              {title}
            </p>
            <p className="text-sm font-bold text-foreground truncate">
              {value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
