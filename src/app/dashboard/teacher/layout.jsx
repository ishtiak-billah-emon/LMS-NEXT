import { requireDashboardRole } from "@/lib/server/dashboard";

export default async function TeacherDashboardLayout({ children }) {
  await requireDashboardRole("teacher");
  return children;
}
