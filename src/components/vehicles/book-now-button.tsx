"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingFlowDrawer } from "./booking-flow-drawer";
import { Driver } from "@/types";

interface BookNowButtonProps {
  vehicleId: string;
  drivers: Driver[];
}

export function BookNowButton({ vehicleId, drivers }: BookNowButtonProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <div className="fixed md:bottom-0 bottom-12 left-0 right-0 p-6 bg-linear-to-t from-background via-background to-transparent z-40">
        <div className="max-w-md mx-auto">
          <Button
            onClick={() => setIsDrawerOpen(true)}
            className="w-full h-12 md:h-14 rounded-3xl bg-primary hover:bg-primary/80 text-primary-foreground font-black uppercase tracking-[0.2em] shadow-2xl relative group overflow-hidden border border-primary/50"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Book Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Button>
        </div>
      </div>

      <BookingFlowDrawer
        vehicleId={vehicleId}
        drivers={drivers}
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </>
  );
}
