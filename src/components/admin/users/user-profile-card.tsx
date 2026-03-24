import { AdminUserProfile } from "@/types";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Wallet,
  Activity,
} from "lucide-react";
import { formatDate } from "date-fns";
import Image from "next/image";
import BackButton from "@/components/layout/back-button";
import PathTillNow from "../shared/path-till-now";

interface UserProfileCardProps {
  user: AdminUserProfile;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BackButton />
        <PathTillNow
          replace={{
            this: user.id,
            with: user.name,
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 md:col-span-2 bg-card border border-border/40 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border/50">
            {user.profile_url ? (
              <Image
                src={user.profile_url}
                alt={user.name}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-10 h-10 text-muted-foreground/40" />
            )}
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {user.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary/60 shrink-0" />
                <span className="font-medium text-foreground truncate">
                  {user.email}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary/60 shrink-0" />
                <span className="font-medium text-foreground">
                  {user.mobile_no || "Not provided"}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary/60 shrink-0" />
                <span className="font-medium text-foreground truncate">
                  {user.native_location || "Not provided"}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary/60 shrink-0" />
                <span className="font-medium text-foreground">
                  Joined {formatDate(new Date(user.created_at), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 bg-card border border-border/40 rounded-2xl p-6 shadow-sm flex flex-col justify-center space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Bookings
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground mt-2">
                {user.total_bookings}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                Cancelled
              </p>
              <p className="text-2xl font-bold tracking-tight mt-2">
                {user.total_cancelled}
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-border/40" />

          <div>
            <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Total Spent
            </p>
            <p className="text-2xl font-black tracking-tight mt-2">
              ₹{user.total_spent.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
