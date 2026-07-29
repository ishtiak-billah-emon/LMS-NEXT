import Sidebar from "@/components/dashboard/Sidebar";
import { dashboardMenus } from "@/config/dashboardMenu";
import { getCurrentUser } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();
  const role = user?.role?.toLowerCase();
  const menuItems = dashboardMenus[role] || dashboardMenus.student;

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar user={{ ...user, role }} items={menuItems} />
      <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
