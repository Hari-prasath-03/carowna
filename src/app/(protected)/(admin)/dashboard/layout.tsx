import { Metadata } from "next";
import { Figtree } from "next/font/google";
import { cn } from "@/lib/utils";
import "@/app/globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carvona - Vendor",
  description: "Carvona Vendor Dashboard",
};

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(figtree.variable, "antialiased")}>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  );
}
