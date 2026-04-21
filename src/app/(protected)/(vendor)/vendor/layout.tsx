import { redirect } from "next/navigation";
import { getUser } from "@/service/self-user";
import hasPermission from "@/permissions";
import Sidebar from "@/components/layout/sidebar";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, userErr] = await getUser();
  if (!user || userErr) redirect("/login");

  if (!hasPermission(user, "provider:resources")) redirect("/");

  return (
    <div className="flex min-h-screen">
      <Sidebar
        parentPath="/vendor"
        header={{
          title: "Vendor Panel",
          subtitle: "Manage resources",
        }}
        menuItems={[
          {
            icon: "LayoutDashboard",
            label: "Dashboard",
            href: "/vendor",
          },
          {
            icon: "Car",
            label: "Vehicles",
            href: "/vendor/vehicles",
          },
          {
            icon: "CalendarCheck",
            label: "Bookings",
            href: "/vendor/bookings",
          },
        ]}
        user={{
          details: user,
        }}
      />
      <main className="flex-1 pl-72">
        <div className="p-8 max-w-400 mx-auto">{children}</div>
      </main>
    </div>
  );
}
