import HelpContentView from "@/components/user/help/help-content-view";
import { cancellationAndRefundPolicy } from "@/constants/app-content";

export default function CancellationAndRefundPage() {
  return <HelpContentView data={cancellationAndRefundPolicy} />;
}
