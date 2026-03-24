"use client";

import ActiveStatusTracker from "@/components/shared/active-status-tracker";
import ThemeProvider from "@/providers/theme-provider";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <ActiveStatusTracker />
      {children}
    </ThemeProvider>
  );
}
