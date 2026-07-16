import CourseToolbar from "./CourseToolbar";
import CourseTable from "./CourseTable";
import { getCoursesByTeacher } from "./actions";
import { getCurrentUser } from "@/lib/server/auth";

export default async function TeacherCoursesPage() {
  const user = await getCurrentUser();
  const teacherId = user?._id || user?.id;
  const courses = teacherId ? await getCoursesByTeacher(teacherId) : [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage teacher courses.</p>
        </div>

        <CourseToolbar />
      </div>

      <CourseTable courses={courses} />
    </div>
  );
}
