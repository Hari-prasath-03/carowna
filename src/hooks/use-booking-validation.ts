"use client";

import { useState, useEffect, TransitionStartFunction } from "react";

export interface ValidationStatus {
  isValid: boolean;
  reason?: string;
  message?: string;
  isChecking: boolean;
}

export function useBookingValidation(
  vehicleId: string,
  startDate: string,
  endDate: string,
  driverId: string | undefined,
  startTransition: TransitionStartFunction,
) {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({
    isValid: true,
    isChecking: false,
  });

  useEffect(() => {
    if (startDate && endDate) {
      const timer = setTimeout(() => {
        setValidationStatus((prev) => ({ ...prev, isChecking: true }));
        startTransition(async () => {
          try {
            const query = new URLSearchParams({
              vehicleId,
              startDate,
              endDate,
            });
            if (driverId) query.append("driverId", driverId);

            const response = await fetch(
              `/api/booking/validate?${query.toString()}`,
            );
            const res = await response.json();

            if (!res.isValid) {
              setValidationStatus({
                isValid: false,
                reason: res.reason,
                message: res.message,
                isChecking: false,
              });
            } else {
              setValidationStatus({
                isValid: true,
                isChecking: false,
              });
            }
          } catch (error) {
            console.error("Validation failed:", error);
            setValidationStatus((prev) => ({ ...prev, isChecking: false }));
          }
        });
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValidationStatus((prev) => {
        if (prev.isValid && !prev.isChecking) return prev;
        return { isValid: true, isChecking: false };
      });
    }
  }, [startDate, endDate, driverId, vehicleId, startTransition]);

  return { validationStatus, setValidationStatus };
}
