import { MapPin, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../../layout/logo";
import FilterDrawer from "./filter-drawer";
import DesktopNavbar from "../../layout/desktop-navbar";
import { getUserLocation } from "@/service/user/user";
import { getVehiclePriceRange } from "@/service/user/vehicles";
import { Activity } from "react";
import Link from "next/link";

export default async function HomeHeader() {
  const [location] = await getUserLocation();
  const [priceRange] = await getVehiclePriceRange();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 max-w-344.5 mx-auto backdrop-blur-md flex items-center gap-3 px-5 py-1.5 md:px-6">
      <Logo width={60} height={60} />

      <div className="flex justify-center md:justify-between w-full mx-10">
        <Activity mode={!!location ? "visible" : "hidden"}>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground/90">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{location}</span>
          </div>
          <DesktopNavbar />
        </Activity>
      </div>

      <FilterDrawer
        minPriceBound={priceRange?.min || 0}
        maxPriceBound={priceRange?.max || 1000}
      >
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-background border-border/40 shadow-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </FilterDrawer>

      <Activity mode={!location ? "visible" : "hidden"}>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </Activity>
    </header>
  );
}
