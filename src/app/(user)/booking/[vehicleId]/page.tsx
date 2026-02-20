export default async function BookingPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>;
}) {
  const { vehicleId } = await params;
  return <div>Booking Page: {vehicleId}</div>;
}
