import { Georama, Montserrat } from "next/font/google";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import "../globals.css";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

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
          <Toaster position="top-right" richColors />
          <NextTopLoader
            color="hsl(var(--primary))"
            shadow="0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary))"
            height={3}
            showSpinner={false}
          />
          {children}
        </div>
      </body>
    </html>
  );
}
