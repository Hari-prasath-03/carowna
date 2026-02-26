import { Metadata } from "next";
import { cn } from "@/lib/utils";
import "../globals.css";
import { Georama, Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

const georama = Georama({
  subsets: ["latin"],
  variable: "--font-serif",
});
export const metadata: Metadata = {
  title: "Carvona - Admin",
  description: "Carvona Admin Dashboard",
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          montserrat.className,
          montserrat.variable,
          georama.variable,
          "antialiased",
        )}
      >
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  );
}
