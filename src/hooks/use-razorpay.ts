/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RazorpayOptions {
  key_id: string;
  order_id: string;
  amount: number;
  currency: string;
  booking_id: string;
  vehicle_name: string;
  user_name: string;
  user_email: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export function useRazorpay() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).Razorpay) return;

    const existingScript = document.getElementById("razorpay-sdk");
    if (existingScript) return;

    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openCheckout = useCallback(
    async (options: RazorpayOptions) => {
      if (!(window as any).Razorpay) {
        console.error("Razorpay SDK not loaded yet.");
        toast.error(
          "Payment system is still loading. Please try again in a moment.",
        );
        return;
      }

      const rzpOptions = {
        key: options.key_id,
        amount: options.amount,
        currency: options.currency,
        name: "Carvona",
        description: `Booking for ${options.vehicle_name}`,
        order_id: options.order_id,
        handler: async function (response: RazorpayResponse) {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                booking_id: options.booking_id,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              toast.success("Payment successful! Booking confirmed.");
              router.push(`/payment/${options.booking_id}`);
            } else {
              toast.error(
                verifyData.error ||
                  "Payment verification failed. Please contact support.",
              );
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("An error occurred during verification.");
          }
        },
        prefill: {
          name: options.user_name,
          email: options.user_email,
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled.");
          },
        },
      };

      try {
        const rzp = new (window as any).Razorpay(rzpOptions);
        rzp.open();
      } catch {
        toast.error("Failed to open payment gateway.");
      }
    },
    [router],
  );

  return { openCheckout };
}
