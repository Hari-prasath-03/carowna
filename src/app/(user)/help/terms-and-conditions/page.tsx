import HelpContentView from "@/components/user/help/help-content-view";
import { termsAndConditions } from "@/constants/app-content";

export default function TermsAndConditionsPage() {
  return <HelpContentView data={termsAndConditions} />;
}
