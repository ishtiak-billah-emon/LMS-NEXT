import { requireDashboardRole } from "@/lib/server/dashboard";

export default async function StudentDashboardLayout({ children }) {
  await requireDashboardRole("student");
  return children;
}
