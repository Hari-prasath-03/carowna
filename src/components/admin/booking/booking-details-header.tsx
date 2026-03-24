import BackButton from "@/components/layout/back-button";
import PathTillNow from "../shared/path-till-now";

export default function BookingDetailsHeader({
  bookingId,
}: {
  bookingId: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BackButton />
        <PathTillNow
          replace={{
            this: bookingId,
            with: `BK-${bookingId.slice(0, 8)}...`,
          }}
        />
      </div>
    </div>
  );
}
