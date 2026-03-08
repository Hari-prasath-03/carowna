import { Booking } from "@/components/admin/recent-bookings";
import { getRecentBookings } from "@/service/admin";
import { useQuery } from "@tanstack/react-query";

export default function useGetRecentBookings() {
  return useQuery<Booking[]>({
    queryKey: ["recent-bookings"],
    queryFn: () => getRecentBookings(5),
  });
}
