import { notFound, redirect } from "next/navigation";
import { Fuel, Users, LocateFixed, BadgeCheck, Star } from "lucide-react";

import SpecCard from "@/components/vehicles/spec-card";
import VerificationCard from "@/components/vehicles/verification-card";
import ImageGallery from "@/components/vehicles/image-gallery";
import BookNowButton from "@/components/vehicles/book-now-button";
import BackButton from "@/components/layout/back-button";
import { getVehicleById } from "@/service/vehicles";
import { getDriversByVendor } from "@/service/drivers";
import { getUser } from "@/service/self-user";

interface VehicleDetailsPageProps {
  params: Promise<{
    vehicleId: string;
  }>;
}

export default async function VehicleDetailsPage({
  params,
}: VehicleDetailsPageProps) {
  const [user, userErr] = await getUser();
  const { vehicleId } = await params;

  if (userErr || !user)
    return redirect(`/login?cb=${encodeURIComponent(`/vehicle/${vehicleId}`)}`);

  const [vehicle, err] = await getVehicleById(vehicleId);
  if (err || !vehicle) return notFound();

  const [drivers] = await getDriversByVendor(vehicle.vendor_id);

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="fixed top-0 left-0 right-0 bg-background/60 backdrop-blur-xl z-50 border-b border-border/40 px-4 h-16 flex items-center justify-between">
        <BackButton />
        <h1 className="text-lg font-black text-foreground uppercase tracking-tight">
          Vehicle Details
        </h1>
        <div className="w-5" />
      </header>

      <section className="relative w-full aspect-4/3 bg-muted overflow-hidden mt-16">
        <ImageGallery images={vehicle.images} name={vehicle.name} />
      </section>

      <main className="px-5 py-8 space-y-10">
        <section className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                {vehicle.brand}
              </p>
              <h2 className="text-3xl font-black text-foreground uppercase tracking-tight leading-none">
                {vehicle.name}
              </h2>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-bold text-muted-foreground">
                  2023 • Pearl White Multi-Coat
                </span>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-foreground">
                    {vehicle.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-foreground leading-none">
                ₹{vehicle.price_per_day}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                per day
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <h3 className="text-xs font-black text-foreground uppercase tracking-[0.15em] opacity-40">
            Specifications
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <SpecCard label="Fuel" value={vehicle.fuel_type} icon={Fuel} />
            <SpecCard
              label="Capacity"
              value={`${vehicle.capacity}-Seater`}
              icon={Users}
            />
            <SpecCard
              label="Transmission"
              value={vehicle.transmission}
              icon={LocateFixed}
            />
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-foreground uppercase tracking-[0.15em] opacity-40">
              Documents & Verification
            </h3>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
              <BadgeCheck className="h-3 w-3 text-green-500" />
              <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">
                Trusted
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <VerificationCard
              label="Insurance Policy"
              subtitle="Valid insurance"
              icon="insurance"
              verified={vehicle.approval_status === "APPROVED"}
              docUrl={vehicle.insurance_doc_url}
            />
            <VerificationCard
              label="RC Document"
              subtitle="Vehicle Registration"
              icon="rc"
              verified={vehicle.approval_status === "APPROVED"}
              docUrl={vehicle.rc_doc_url}
            />
            <VerificationCard
              label="RTO Verification"
              subtitle="Compliance Certified"
              icon="rto"
              verified={vehicle.approval_status === "APPROVED"}
              docUrl={vehicle.rto_verification_doc_url}
            />
          </div>
        </section>
      </main>

      <BookNowButton vehicleId={vehicle.id} drivers={drivers || []} />
    </div>
  );
}
