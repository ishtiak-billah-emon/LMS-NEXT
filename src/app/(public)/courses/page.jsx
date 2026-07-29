import { getCourses } from "@/lib/server/course";
import CourseFilter from "./CourseFilter";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-muted py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <p className="mb-4 text-lg font-semibold text-primary">
              Explore Courses
            </p>

            <h1 className="mb-6 text-5xl font-black leading-tight text-text-primary md:text-6xl">
              Learn Mathematics
              <span className="text-primary"> Smartly</span>
            </h1>

            {/* <p className="max-w-2xl text-lg leading-relaxed text-text-secondary">
              Structured courses for SSC, HSC, and Admission preparation with
              premium learning experience.
            </p> */}
          </div>
        </div>

        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full border border-primary/20"></div>
      </section>

      <CourseFilter courses={courses} />
    </main>
  );
}
