import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  Star,
  Users,
  Clock3,
  Gift,
  PlayCircle,
  Lock,
  CheckCircle2,
  BookOpen,
  Globe,
  Trophy,
} from "lucide-react";

import { getCourse } from "@/lib/server/course";
import EnrollmentRequestModal from "./EnrollmentRequestModal";
import ReviewSection from "./ReviewSection";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";

export default async function CourseDetails({ params }) {
  const { courseId } = await params;

  const {
    course,
    isEnrolled,
    progress = 0,
    completedLessons = 0,
    totalLessons = 0,
  } = await getCourse(courseId);
  console.log("isEnrolled:", isEnrolled);

  if (!course) {
    notFound();
  }

  // =========================
  // COURSE STATS
  // =========================

  const totalSections = course.sections.length;

  const totalPreviewLessons = course.sections.reduce(
    (acc, section) =>
      acc + section.lessons.filter((lesson) => lesson.preview).length,
    0,
  );

  const hasDiscount =
    typeof course.discountPrice === "number" &&
    course.discountPrice > 0 &&
    course.discountPrice < course.price;

  return (
    <main className="bg-background">
      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-border bg-muted">
        {/* Decorative */}
        <div className="absolute -right-32 top-0 h-[500px] w-[500px] rounded-full border border-primary/10"></div>

        <div className="absolute left-0 top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
            {/* =========================================================
                LEFT SIDE
            ========================================================= */}
            <div>
              {/* Category */}
              <div className="mb-6 inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
                {course.classType || course.category}
              </div>

              {/* Thumbnail */}
              <div className="overflow-hidden rounded-[32px] border border-border bg-card shadow-xl">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  width={1200}
                  height={700}
                  className="h-full max-h-[600px] w-full object-cover"
                />
              </div>

              {/* Title */}
              <h1 className="mb-6 mt-2 md:mt-4 max-w-4xl text-4xl font-black leading-tight text-text-primary md:text-5xl lg:text-6xl">
                {course.title}
              </h1>

              {/* Description */}
              <p className="mb-8 max-w-3xl text-lg leading-relaxed text-text-secondary">
                {course.description}
              </p>

              {/* Stats */}
              <div className="mb-10 flex flex-wrap gap-6">
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />

                  <div>
                    <p className="font-bold text-text-primary">
                      {course.rating}
                    </p>

                    <p className="text-xs text-text-secondary">Course Rating</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3">
                  <Users className="h-5 w-5 text-primary" />

                  <div>
                    <p className="font-bold text-text-primary">
                      {course.totalStudents}+
                    </p>

                    <p className="text-xs text-text-secondary">Students</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3">
                  <BookOpen className="h-5 w-5 text-primary" />

                  <div>
                    <p className="font-bold text-text-primary">
                      {totalLessons}
                    </p>

                    <p className="text-xs text-text-secondary">Lessons</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3">
                  <Clock3 className="h-5 w-5 text-primary" />

                  <div>
                    <p className="font-bold text-text-primary">
                      {totalSections}
                    </p>

                    <p className="text-xs text-text-secondary">Sections</p>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================
                PURCHASE CARD
            ========================================================= */}
            <div className="relative lg:pt-[60px]">
              <div className="sticky top-24 overflow-hidden rounded-[32px] border border-border bg-card shadow-xl">
                {/* Top Gradient */}
                <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>

                <div className="p-8">
                  {isEnrolled && (
                    <div className="mb-6 rounded-2xl border border-border bg-muted/40 p-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-text-primary">
                          Your progress
                        </span>
                        <span className="text-text-secondary">
                          {completedLessons} of {totalLessons} lessons ·{" "}
                          {progress}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-8">
                    <div className="mb-2 flex items-center gap-4">
                      <h2 className="text-5xl font-black text-primary">
                        ৳{hasDiscount ? course.discountPrice : course.price}
                      </h2>

                      {hasDiscount && (
                        <span className="text-2xl text-text-secondary line-through">
                          ৳{course.price}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-text-secondary">
                      Lifetime access included
                    </p>
                  </div>

                  <EnrollmentRequestModal course={course} />

                  {/* Features */}
                  <div className="space-y-5 border-t border-border pt-8">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />

                      <span className="text-text-secondary">
                        Full lifetime access
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <PlayCircle className="h-5 w-5 text-primary" />

                      <span className="text-text-secondary">
                        {totalLessons} premium lessons
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-primary" />

                      <span className="text-text-secondary">
                        Access on mobile & desktop
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Trophy className="h-5 w-5 text-primary" />

                      <span className="text-text-secondary">
                        Certificate of completion
                      </span>
                    </div>
                  </div>

                  {/* Preview Badge */}
                  <div className="mt-8 rounded-2xl bg-primary/10 p-5">
                    <p className="mb-1 font-bold text-primary">
                      {totalPreviewLessons} Free Preview Lessons
                    </p>

                    <p className="text-sm text-text-secondary">
                      Watch selected lessons before purchasing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          COURSE CONTENT
      ========================================================= */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-12">
            <p className="mb-3 text-lg font-semibold text-primary">
              Course Curriculum
            </p>

            <h2 className="text-4xl font-black text-text-primary">
              Explore Course Content
            </h2>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="space-y-6">
            {course.sections.map((section, sectionIndex) => (
              <AccordionItem
                key={section._id}
                value={section._id}
                className="overflow-hidden rounded-[28px] border border-border bg-card px-0 shadow-sm"
              >
                {/* =========================================================
                      SECTION HEADER
                  ========================================================= */}
                <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                  <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-text-primary">
                        Section {sectionIndex + 1}: {section.title}
                      </h3>

                      <p className="mt-2 text-sm text-text-secondary">
                        {section.lessons.length} lessons included
                      </p>
                    </div>

                    <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                      Section {section.order}
                    </div>
                  </div>
                </AccordionTrigger>

                {/* =========================================================
                      LESSONS
                  ========================================================= */}
                <AccordionContent className="border-t border-border bg-muted/30 px-0 py-0">
                  <div className="divide-y divide-border">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson._id}
                        className="flex flex-col gap-4 px-8 py-5 transition hover:bg-primary/5 md:flex-row md:items-center md:justify-between"
                      >
                        {/* Left */}
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div
                            className={`mt-1 flex h-11 w-11 items-center justify-center rounded-2xl ${
                              lesson.preview
                                ? "bg-primary text-white"
                                : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {lesson.preview ? (
                              <PlayCircle className="h-5 w-5" />
                            ) : (
                              <Lock className="h-5 w-5" />
                            )}
                          </div>

                          {/* Lesson Info */}
                          <div>
                            <h4 className="mb-2 text-lg font-semibold text-text-primary">
                              Lesson {lessonIndex + 1}: {lesson.title}
                            </h4>

                            <div className="flex flex-wrap items-center gap-3">
                              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-text-secondary">
                                {lesson.duration}
                              </span>

                              {lesson.preview ? (
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                  Free Preview
                                </span>
                              ) : (
                                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                  Premium Lesson
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right */}
                        <div>
                          <Link
                            href={`/learn/${course.slug}/${lesson.slug}`}
                            className={`inline-flex items-center rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                              lesson.preview || isEnrolled
                                ? "bg-primary text-white hover:bg-primary-hover"
                                : "border border-border bg-white text-text-secondary hover:border-primary hover:text-primary"
                            }`}
                          >
                            {lesson.preview ? (
                              <>
                                <PlayCircle className="mr-2 h-4 w-4" />
                                Watch Preview
                              </>
                            ) : isEnrolled ? (
                              <>
                                <PlayCircle className="mr-2 h-4 w-4" />
                                Watch Lesson
                              </>
                            ) : (
                              <>
                                <Lock className="mr-2 h-4 w-4" />
                                Locked
                              </>
                            )}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* =========================================================
          REVIEWS SECTION
      ========================================================= */}
      <ReviewSection courseId={course._id} isEnrolled={isEnrolled} />
    </main>
  );
}
