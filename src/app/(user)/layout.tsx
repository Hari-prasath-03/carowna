import { Metadata } from "next";
import { Montserrat, Georama } from "next/font/google";

import NextTopLoader from "nextjs-toploader";
import BottomNav from "@/components/layout/bottom-nav-bar";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import "../globals.css";
import Provider from "./provider";

export const metadata: Metadata = {
  title: "Carvona",
  description: "Carvona - Premium Car Rentals",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

const georama = Georama({
  subsets: ["latin"],
  variable: "--font-serif",
});

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          georama.className,
          montserrat.variable,
          georama.variable,
          "antialiased",
        )}
      >
        <NextTopLoader
          color="hsl(var(--primary))"
          shadow="0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary))"
          height={3}
          showSpinner={false}
        />
        <div className="min-h-screen max-w-344.5 mx-auto bg-background text-foreground">
          <Toaster position="top-center" richColors />
          <Provider>{children}</Provider>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
