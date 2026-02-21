import { Metadata } from "next";
import { Montserrat, Georama } from "next/font/google";
import { cn } from "@/lib/utils";
import "../globals.css";

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
    <html lang="en">
      <body
        className={cn(montserrat.className, georama.className, "antialiased")}
      >
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  );
}
