import { redirect } from "next/navigation";
import { getUser } from "@/service/self-user";
import hasPermission from "@/permissions";
import Sidebar from "@/components/layout/sidebar";
import Provider from "./provider";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, userErr] = await getUser();
  if (!user || userErr) redirect("/login");

  if (!hasPermission(user, "monitor:everything")) redirect("/");

  return (
    <div className="flex min-h-screen">
      <Sidebar
        parentPath="/dashboard"
        header={{
          title: "Admin Panel",
          subtitle: "Vehicle Platform",
        }}
        menuItems={[
          {
            icon: "LayoutDashboard",
            label: "Dashboard",
            href: "/dashboard",
          },
          {
            icon: "Store",
            label: "Vendors",
            href: "/dashboard/vendors",
          },
          {
            icon: "Users",
            label: "Users",
            href: "/dashboard/users",
          },
          {
            icon: "CalendarCheck",
            label: "Bookings",
            href: "/dashboard/bookings",
          },
          {
            icon: "ShieldCheck",
            label: "Approvals",
            href: "/dashboard/pending-approvals",
          },
        ]}
        user={{
          details: user,
          profilePath: "/dashboard/profile",
        }}
      />
      <main className="flex-1 pl-72">
        <div className="p-8 max-w-400 mx-auto">
          <Provider>{children}</Provider>
        </div>
      </main>
    </div>
  );
}
