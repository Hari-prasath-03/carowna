import { redirect } from "next/navigation";
import { Settings } from "lucide-react";

import KYCSection from "@/components/user/profile/kyc-section";
import UserInfoCard from "@/components/user/profile/user-info-card";
import SupportSection from "@/components/user/profile/support-section";
import AccountActions from "@/components/user/profile/account-actions";
import SettingsDrawer from "@/components/user/profile/settings-drawer";
import BackButton from "@/components/layout/back-button";
import { getUserDetails } from "@/service/user/user";
import { getUser } from "@/service/self-user";

export default async function ProfilePage() {
  const [user, err] = await getUser();
  if (err) redirect("/login?cb=/profile");

  const [userDetails, unexpectedError] = await getUserDetails(user.id);
  if (unexpectedError) redirect("/");

  const profileData = {
    name: userDetails.display_name,
    phone: userDetails.mobile_no,
    email: userDetails.email,
    membership: "Gold Elite",
    since: userDetails.created_at.split("-")[0],
    avatarUrl: userDetails.profile_url,
    date_of_birth: userDetails.date_of_birth,
    native_location: userDetails.native_location,
    gender: userDetails.gender,
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="fixed top-0 left-0 right-0 bg-background/60 backdrop-blur-xl z-50 border-b border-border/40 px-4 h-16 flex items-center justify-between">
        <BackButton />
        <h1 className="text-lg font-black text-foreground uppercase tracking-tight">
          Profile
        </h1>
        <SettingsDrawer>
          <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted text-foreground transition-colors">
            <Settings className="h-6 w-6" />
          </button>
        </SettingsDrawer>
      </header>

      <main className="pt-20 px-4 space-y-8 max-w-md mx-auto">
        <UserInfoCard userId={user.id} {...profileData} />
        <KYCSection
          userId={user.id}
          aadhaar_verified={userDetails.aadhaar_verified}
          license_verified={userDetails.license_verified}
          aadhaar_doc_url={userDetails.aadhaar_doc_url}
          license_doc_url={userDetails.license_doc_url}
        />
        <SupportSection />
        <AccountActions />
      </main>
    </div>
  );
}
