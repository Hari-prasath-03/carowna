"use client";

import { useEffect } from "react";
import { updateLastActiveAction } from "@/actions/user/update-last-active";

const PING_INTERVAL_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "carvona_last_active_ping";

export default function ActiveStatusTracker() {
  useEffect(() => {
    const pingStatus = async () => {
      try {
        const lastPingStr = localStorage.getItem(STORAGE_KEY);
        const now = Date.now();

        if (
          !lastPingStr ||
          now - parseInt(lastPingStr, 10) > PING_INTERVAL_MS
        ) {
          await updateLastActiveAction();
          localStorage.setItem(STORAGE_KEY, now.toString());
        }
      } catch (error) {
        console.log("Failed to track active status:", error);
      }
    };

    const timer = setTimeout(pingStatus, 2000);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
