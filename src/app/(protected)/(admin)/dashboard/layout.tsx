import { Sidebar } from "@/components/admin/sidebar";
import "@/app/globals.css";
import { getUser } from "@/service/self-user";
import { redirect } from "next/navigation";
import hasPermission from "@/permissions";

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
      <Sidebar />
      <main className="flex-1 pl-72">
        <div className="p-8 max-w-400 mx-auto">{children}</div>
      </main>
    </div>
  );
}
