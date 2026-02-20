export default async function VehicleDetailsPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>;
}) {
  const { vehicleId } = await params;
  return <div>Vehicle Details: {vehicleId}</div>;
}
