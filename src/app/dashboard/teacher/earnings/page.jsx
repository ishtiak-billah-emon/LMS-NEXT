import EarningsDashboard from "./EarningDashboard.jsx";
import { getEnrollments } from "@/lib/server/enrollment";

export default async function Page() {
  const enrollments = await getEnrollments();

  return <EarningsDashboard enrollments={enrollments.data || []} />;
}
