import { notFound } from "next/navigation";
import { getVehicleApprovalDetails } from "@/service/admin/approvals";
import VehicleApprovalDetailsView from "@/components/admin/approvals/vehicle-approval-details";

interface ApprovalDetailsPageProps {
  params: Promise<{ vehicleId: string }>;
}

export default async function ApprovalDetailsPage({
  params,
}: ApprovalDetailsPageProps) {
  const { vehicleId } = await params;

  const vehicle = await getVehicleApprovalDetails(vehicleId);
  if (!vehicle) notFound();
  return <VehicleApprovalDetailsView vehicle={vehicle} />;
}
