"use client";

import { useState } from "react";
import { toast } from "sonner";

interface UseGeolocationReturn {
  location: string;
  isLocating: boolean;
  setLocation: (location: string) => void;
  fetchCurrentLocation: () => void;
}

export function useGeolocation(
  initialLocation: string = "",
): UseGeolocationReturn {
  const [location, setLocation] = useState(initialLocation);
  const [isLocating, setIsLocating] = useState(false);

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
          );
          const data = await response.json();

          if (data && data.display_name) {
            setLocation(data.display_name);
            toast.success("Location updated!");
          } else {
            toast.error("Could not determine location name");
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          toast.error("Failed to fetch location name");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Permission denied or location unavailable");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
  };

  return {
    location,
    isLocating,
    setLocation,
    fetchCurrentLocation,
  };
}
