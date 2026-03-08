import { getUserBookings } from "@/service/bookings";
import { useQuery } from "@tanstack/react-query";

export default function useGetUserBookingHistory(userId: string) {
  return useQuery({
    queryKey: ["user-booking-history", userId],
    queryFn: () => getUserBookings(userId),
  });
}
