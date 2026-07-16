import MarkCompleteButton from "@/components/course/CompletedButton";
import { getLesson } from "@/services/lesson.services";
import { getCurrentUser } from "@/lib/server/auth";

import {
  Lock,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  FileText,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

import { notFound, redirect } from "next/navigation";

export default async function LearnPage({ params }) {
  const { courseSlug, lessonSlug } = await params;

  const response = await getLesson(courseSlug, lessonSlug);

  if (response.status === 401) {
    redirect(`/login?redirect=/learn/${courseSlug}/${lessonSlug}`);
  }

  if (response.status === 404) {
    notFound();
  }

  if (response.status !== 200) {
    throw new Error("Failed to load lesson");
  }

  const { lesson, course, section, canWatch, completed } = response.data;
  const user = await getCurrentUser();
  const teacherId = String(
    typeof course.teacher === "object"
      ? course.teacher?._id || course.teacher?.id
      : course.teacher,
  );
  const userId = String(user?._id || user?.id);
  const isCourseTeacher =
    user?.role?.toLowerCase() === "teacher" && teacherId === userId;
  const canWatchLesson = canWatch || isCourseTeacher;

  function getEmbedUrl(url) {
    const id =
      url.match(/youtu\.be\/([^?]+)/)?.[1] || url.match(/v=([^&]+)/)?.[1];

    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[1fr_400px]">
        {/* =========================================================
            LEFT SIDE
        ========================================================= */}
        <div className="flex flex-col">
          {/* Top Bar */}
          <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
              {/* Left */}
              <div>
                {/* <p className="mb-1 text-sm font-medium text-primary">
                  {section.title}
                </p> */}

                <h1 className="text-2xl font-bold text-text-primary">
                  {lesson.title}
                </h1>
              </div>

              {/* Right */}
              <Link
                href={`/courses/${course.slug}`}
                className="inline-flex items-center rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-primary hover:text-primary"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back To Course
              </Link>
            </div>
          </div>

          {/* =========================================================
              VIDEO PLAYER
          ========================================================= */}
          <div className="flex-1 p-4 md:p-8">
            <div className="overflow-hidden rounded-[32px] border border-border bg-card shadow-xl">
              {/* Video */}
              <div className="relative aspect-video bg-black">
                {canWatchLesson ? (
                  <iframe
                    src={getEmbedUrl(lesson.videoUrl)}
                    title={lesson.title}
                    allowFullScreen
                    className="h-full w-full"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-center">
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl">
                      <Lock className="h-10 w-10 text-white" />
                    </div>

                    <h2 className="mb-4 text-4xl font-black text-white">
                      Premium Lesson
                    </h2>

                    <p className="mb-8 max-w-xl text-lg leading-relaxed text-slate-300">
                      Enroll in this course to unlock all premium lessons and
                      access the complete learning experience.
                    </p>

                    <Link
                      href={`/courses/${course.slug}`}
                      className="inline-flex items-center rounded-2xl bg-primary px-8 py-4 text-base font-bold text-white transition hover:bg-primary-hover"
                    >
                      Purchase Course
                    </Link>
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="p-8">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  {/* <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                    {section.title}
                  </span> */}

                  <span className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-text-secondary">
                    {lesson.duration}
                  </span>

                  {lesson.preview ? (
                    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                      Free Preview
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                      Premium Lesson
                    </span>
                  )}
                </div>

                <h2 className="mb-4 text-4xl font-black text-text-primary">
                  {lesson.title}
                </h2>

                <p className="max-w-3xl text-lg leading-relaxed text-text-secondary">
                  {course.description}
                </p>

                {canWatchLesson && lesson.resources?.length > 0 && (
                  <div className="mt-8 border-t border-border pt-8">
                    <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-text-primary">
                      <FileText className="h-5 w-5 text-primary" />
                      Resources
                    </h3>

                    <ul className="space-y-3">
                      {lesson.resources.map((resource) => (
                        <li key={resource._id}>
                          <a
                            href={resource.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between gap-3 rounded-2xl border border-border p-4 transition hover:border-primary/40 hover:bg-muted"
                          >
                            <span className="font-medium text-text-primary">
                              {resource.title}
                            </span>

                            <ExternalLink className="h-4 w-4 text-text-secondary" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {canWatchLesson && (
                  <div className="mt-8 flex justify-end border-t border-border pt-8">
                    <MarkCompleteButton
                      courseSlug={course.slug}
                      lessonSlug={lesson.slug}
                      completed={completed}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT SIDEBAR
        ========================================================= */}
        <aside className="border-l border-border bg-card">
          {/* Sidebar Header */}
          <div className="sticky top-0 z-20 border-b border-border bg-card p-6">
            <h2 className="text-2xl font-black text-text-primary">
              Course Curriculum
            </h2>

            <p className="mt-2 text-text-secondary">Continue learning</p>
          </div>

          {/* Curriculum */}
          <div className="h-[calc(100vh-100px)] overflow-y-auto">
            <div className="space-y-8 p-6">
              {course.sections.map((section) => (
                <div key={section._id}>
                  {/* Section Title */}
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-text-primary">
                      {section.title}
                    </h3>

                    <span className="text-sm text-text-secondary">
                      {section.lessons.length} lessons
                    </span>
                  </div>

                  {/* Lessons */}
                  <div className="space-y-3">
                    {section.lessons.map((item) => {
                      const isActive = item.slug === lesson.slug;
                      const isLessonUnlocked = item.preview || isCourseTeacher;

                      return (
                        <Link
                          key={item._id}
                          href={`/learn/${course.slug}/${item.slug}`}
                          className={`block rounded-2xl border p-4 transition ${
                            isActive
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/40 hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div
                              className={`mt-1 flex h-10 w-10 items-center justify-center rounded-xl ${
                                isLessonUnlocked
                                  ? "bg-primary text-white"
                                  : "bg-slate-200 text-slate-500"
                              }`}
                            >
                              {isLessonUnlocked ? (
                                <PlayCircle className="h-4 w-4" />
                              ) : (
                                <Lock className="h-4 w-4" />
                              )}
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <h4
                                className={`line-clamp-2 text-sm font-semibold ${
                                  isActive
                                    ? "text-primary"
                                    : "text-text-primary"
                                }`}
                              >
                                {item.title}
                              </h4>

                              <div className="mt-2 flex items-center justify-between gap-2">
                                <span className="text-xs text-text-secondary">
                                  {item.duration}
                                </span>

                                {isLessonUnlocked ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Lock className="h-4 w-4 text-slate-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
