import { getCurrentUser } from "@/lib/server/auth";
import StudentProfile from "@/components/dashboard/StudentProfile";

export default async function TeacherProfilePage() {
  const user = await getCurrentUser();

  return <StudentProfile user={user} />;
}
