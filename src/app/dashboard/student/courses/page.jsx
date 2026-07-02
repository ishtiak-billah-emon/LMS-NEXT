import Link from "next/link";
import Image from "next/image";
import { BookOpen, PlayCircle } from "lucide-react";
import { getMyCourses } from "@/lib/server/enrollment";

export default async function StudentCoursesPage() {
  const enrollments = await getMyCourses();

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">My Courses</h1>
          <p className="mt-2 text-slate-600">
            Continue enrolled courses and monitor your progress.
          </p>
        </div>

        <Link
          href="/courses"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <BookOpen size={18} />
          Find Courses
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-slate-400" />

          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            No enrolled courses yet
          </h2>

          <p className="mt-2 text-slate-500">
            Browse courses and start learning today.
          </p>

          <Link
            href="/courses"
            className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {enrollments.map((enrollment) => (
            <article
              key={enrollment._id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={enrollment.course.thumbnail}
                  alt={enrollment.course.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <h2 className="line-clamp-2 text-lg font-semibold text-slate-900">
                  {enrollment.course.title}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {enrollment.completedLessons.length} of{" "}
                  {enrollment.totalLessons} lessons completed
                </p>

                <div className="mt-4 h-2 rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-indigo-600"
                    style={{
                      width: `${enrollment.progress}%`,
                    }}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold text-indigo-600">
                    {enrollment.progress}%
                  </span>

                  <Link
                    href={`/courses/${enrollment.course.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <PlayCircle size={17} />
                    Resume
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
