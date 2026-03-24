import { notFound } from "next/navigation";
import { getVehicleApprovalDetails } from "@/service/admin/approvals";
import VehicleApprovalDetailsView from "@/components/admin/approvals/vehicle-approval-details";

interface ApprovalDetailsPageProps {
  params: Promise<{ type: string; itemId: string }>;
}

export default async function ApprovalDetailsPage({
  params,
}: ApprovalDetailsPageProps) {
  const { type, itemId } = await params;

  switch (type) {
    case "vehicles": {
      const vehicle = await getVehicleApprovalDetails(itemId);
      if (!vehicle) notFound();
      return <VehicleApprovalDetailsView vehicle={vehicle} />;
    }
    case "drivers": {
      return (
        <div className="flex flex-col items-center justify-center min-h-60 gap-3 text-muted-foreground">
          <p className="text-sm font-semibold opacity-60">
            Driver approval details coming soon.
          </p>
        </div>
      );
    }
    default:
      notFound();
  }
}
