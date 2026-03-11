import { MapPin, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../../layout/logo";
import FilterDrawer from "./filter-drawer";
import DesktopNavbar from "../../layout/desktop-navbar";
import { getUserLocation } from "@/service/user";
import { getVehiclePriceRange } from "@/service/vehicles";

export default async function HomeHeader() {
  const [location] = await getUserLocation();
  const [priceRange] = await getVehiclePriceRange();

  return (
    <header className="flex items-center justify-between px-4 py-4 md:px-6">
      <Logo width={40} height={40} />

      <div className="flex justify-center md:justify-between w-full mx-10">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground/90">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{location}</span>
        </div>

        <DesktopNavbar />
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
    </header>
  );
}
