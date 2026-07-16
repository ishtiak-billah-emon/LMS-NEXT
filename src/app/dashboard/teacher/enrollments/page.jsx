import { getEnrollments } from "./actions";
import EnrollmentTable from "./components/EnrollmentTable";

export default async function EnrollmentPage() {
  const enrollments = await getEnrollments();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Enrollments</h1>
        <p className="text-muted-foreground">Manage student enrollments.</p>
      </div>

      <EnrollmentTable enrollments={enrollments} />
    </div>
  );
}
