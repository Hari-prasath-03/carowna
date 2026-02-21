import { Metadata } from "next";
import { Georama, Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import "../globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

const georama = Georama({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          montserrat.variable,
          georama.className,
          georama.variable,
          "antialiased",
        )}
      >
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 via-background to-accent/10 p-4">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
