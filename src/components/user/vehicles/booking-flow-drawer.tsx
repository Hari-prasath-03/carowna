"use client";

import { Activity, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronLeft } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import ChoiceStep from "../user/booking/choice-step";
import DriverSelectionStep from "../user/booking/driver-selection-step";
import { Driver } from "@/types";

interface BookingFlowDrawerProps {
  vehicleId: string;
  drivers: Driver[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BookingFlowDrawer({
  vehicleId,
  drivers,
  isOpen,
  onOpenChange,
}: BookingFlowDrawerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isShowDrivers, setIsShowDrivers] = useState(false);

  const handleBooking = (driverId?: string) => {
    setLoading(true);
    router.push(`/booking/${vehicleId}${driverId ? `/${driverId}` : ""}`);
  };

  const handleBack = () => setIsShowDrivers(false);

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md mx-auto">
        <div className="absolute top-4 right-4 z-50">
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </div>

        <DrawerHeader className="pb-0 pt-8">
          <DrawerTitle className="text-2xl font-black uppercase tracking-tight text-center relative">
            <Activity mode={isShowDrivers ? "visible" : "hidden"}>
              <button
                onClick={handleBack}
                className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </Activity>
            <span className="block px-8 truncate">
              {isShowDrivers ? "Select Your Driver" : "Choose Rental Type"}
            </span>
          </DrawerTitle>
        </DrawerHeader>

        <div className="p-6 space-y-6">
          <Activity mode={!isShowDrivers ? "visible" : "hidden"}>
            <ChoiceStep
              onSelfDrive={() => handleBooking()}
              onNeedDriver={() => setIsShowDrivers(true)}
              loading={loading}
            />
          </Activity>
          <Activity mode={isShowDrivers ? "visible" : "hidden"}>
            <DriverSelectionStep
              drivers={drivers}
              onSelect={handleBooking}
              onBack={handleBack}
              loading={loading}
            />
          </Activity>

          <div className="bg-muted/30 rounded-2xl p-4 border border-border/40 text-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-relaxed">
              Selection will be applied to your final booking summary
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
