import { Metadata } from "next";
import { Montserrat, Georama } from "next/font/google";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/layout/bottom-nav-bar";
import { ThemeProvider } from "@/components/providers/theme-provider";
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          georama.className,
          montserrat.variable,
          georama.variable,
          "antialiased",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen max-w-344.5 mx-auto bg-background text-foreground">
            {children}
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
