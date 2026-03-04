import { getUserBookings } from "@/service/bookings";
import { getUser } from "@/service/self-user";
import { redirect } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import HistoryClient from "./history-client";

export default async function HistoryPage() {
  const [user, userErr] = await getUser();
  if (userErr || !user) {
    return redirect("/login");
  }

  const [bookings, bookingsErr] = await getUserBookings(user.id);

  if (bookingsErr || !bookings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <p className="text-muted-foreground">
          Failed to load booking history. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <HistoryHeader />
      <main className="pt-16 max-w-lg mx-auto">
        <HistoryClient initialBookings={bookings} />
      </main>
    </div>
  );
}

function HistoryHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b border-border px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-black uppercase tracking-tight">
          Booking History
        </h1>
      </div>
      <button className="p-2 hover:bg-muted rounded-full transition-colors font-bold uppercase tracking-tight">
        <Search className="h-5 w-5" />
      </button>
    </header>
  );
}
