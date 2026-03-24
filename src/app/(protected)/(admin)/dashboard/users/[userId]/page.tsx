import { notFound } from "next/navigation";
import { getUserDetails, getUserBookings } from "@/service/admin/users";
import UserProfileCard from "@/components/admin/users/user-profile-card";
import UserBookingsTable from "@/components/admin/users/user-bookings-table";

interface UserDetailsPageProps {
  params: Promise<{ userId: string }>;
  searchParams?: Promise<{ page?: string }>;
}

export default async function UserDetailsPage({
  params,
  searchParams,
}: UserDetailsPageProps) {
  const { userId } = await params;
  const sParams = await searchParams;
  const currentPage = Number(sParams?.page) || 1;

  const [user, bookingsResponse] = await Promise.all([
    getUserDetails(userId),
    getUserBookings(userId, currentPage),
  ]);

  if (!user) notFound();

  return (
    <div className="space-y-8">
      <UserProfileCard user={user} />

      <UserBookingsTable
        bookings={bookingsResponse.bookings}
        currentPage={currentPage}
        totalPages={bookingsResponse.totalPages}
        total={bookingsResponse.total}
      />
    </div>
  );
}
