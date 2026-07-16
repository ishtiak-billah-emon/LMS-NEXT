import Image from "next/image";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/server/auth";
import { getCoursesByTeacher } from "../actions";
import CourseStatusAction from "./CourseStatusAction";
import EditCourseDialog from "./EditCourseDialog";
import SectionManager from "./SectionManager";
import TeacherReviewsSection from "./TeacherReviewsSection";

export default async function TeacherCourseDetailsPage({ params }) {
  const { courseSlug } = await params;
  const user = await getCurrentUser();
  const teacherId = user?._id || user?.id;
  const courses = teacherId ? await getCoursesByTeacher(teacherId) : [];
  const course = courses.find((item) => item.slug === courseSlug);

  if (!course) {
    notFound();
  }

  return (
    <main className="space-y-6 p-6">
      <div className="overflow-hidden rounded-lg border bg-background">
        <Image
          src={course.thumbnail}
          alt={course.title}
          width={1200}
          height={500}
          className="h-64 w-full object-cover"
        />

        <div className="space-y-4 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground">{course.slug}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <EditCourseDialog course={course} />
              <CourseStatusAction course={course} />
            </div>
          </div>

          <p className="text-sm leading-6 text-muted-foreground">
            {course.description}
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Info title="Category" value={course.category} />
            <Info title="Status" value={course.status} />
            <Info title="Price" value={`৳${course.price}`} />
            <Info title="Discount Price" value={`৳${course.discountPrice}`} />
            <Info title="Total Students" value={course.totalStudents ?? 0} />
            <Info title="Rating" value={course.rating ?? 0} />
            <Info title="Total Reviews" value={course.totalReviews ?? 0} />
            <Info title="Featured" value={course.isFeatured ? "Yes" : "No"} />
            <Info title="Duration" value={course.totalDuration ?? 0} />
            <Info title="Sections" value={course.sections?.length ?? 0} />
            <Info
              title="Created"
              value={new Date(course.createdAt).toLocaleDateString()}
            />
            <Info
              title="Updated"
              value={new Date(course.updatedAt).toLocaleDateString()}
            />
          </div>
        </div>
      </div>

      <SectionManager course={course} />

      <div className="overflow-hidden rounded-lg border bg-background p-6">
        <TeacherReviewsSection courseId={course._id} teacherId={teacherId} />
      </div>
    </main>
  );
}

function Info({ title, value }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-1 font-medium capitalize">{value}</p>
    </div>
  );
}
