import HelpContentView from "@/components/user/help/help-content-view";
import { privacyPolicy } from "@/constants/app-content";

export default function PrivacyPolicyPage() {
  return <HelpContentView data={privacyPolicy} />;
}
