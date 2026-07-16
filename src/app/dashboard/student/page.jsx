import Link from "next/link";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Heart,
  PlayCircle,
  TrendingUp,
} from "lucide-react";
import { getCurrentUser } from "@/lib/server/auth";
import { getEnrollments } from "@/lib/server/enrollment";
import { getTodayActivity } from "@/lib/server/todayActivity";
import DailyGoalCard from "@/components/dashboard/DailyGoalCard";
import WishlistCount from "@/components/dashboard/WishlistCount";

function formatTime(value) {
  try {
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default async function StudentDashboard() {
  const user = await getCurrentUser();
  const firstName = user?.fullName?.split(" ")?.[0] || "Student";

  const enrollmentsResponse = await getEnrollments();
  const enrollments = enrollmentsResponse?.data ?? [];

  const courses = enrollments.map((enrollment) => ({
    id: enrollment._id,
    title: enrollment.courseTitle,
    slug: enrollment.courseSlug,
    progress: enrollment.progress ?? 0,
    completedLessons: enrollment.completedLessons ?? 0,
    totalLessons: enrollment.totalLessons ?? 0,
    completedDurationSeconds: enrollment.completedDurationSeconds ?? 0,
  }));

  const totalLearnedSeconds = courses.reduce(
    (sum, course) => sum + (course.completedDurationSeconds || 0),
    0
  );
  const hoursLearned = (totalLearnedSeconds / 3600).toFixed(1);

  const todayActivity = await getTodayActivity();
  const completedToday = todayActivity.length;
  const dailyGoal = user?.dailyLessonGoal ?? 0;

  const stats = [
    {
      label: "Enrolled courses",
      value: String(courses.length),
      icon: BookOpen,
      tone: "bg-indigo-50 text-indigo-700",
    },
    {
      label: "Hours learned",
      value: hoursLearned,
      icon: Clock3,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Certificates",
      value: "0",
      icon: Award,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Wishlist",
      value: <WishlistCount />,
      icon: Heart,
      tone: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-700">
            Student dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Track your courses, continue lessons, and keep your learning plan on
            schedule.
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <BookOpen size={18} />
          Browse courses
        </Link>
      </div>

      {/* Daily goal prompt + tracker */}
      <div className="mb-6">
        <DailyGoalCard initialGoal={dailyGoal} completedToday={completedToday} />
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-lg border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">
                    {stat.value}
                  </p>
                </div>
                <span
                  className={`flex size-11 items-center justify-center rounded-lg ${stat.tone}`}
                >
                  <Icon size={22} />
                </span>
              </div>
            </div>
          );
        })}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-950">Continue learning</h2>
              <p className="mt-1 text-sm text-slate-500">
                Pick up from your latest lessons.
              </p>
            </div>
            <TrendingUp size={20} className="text-indigo-600" />
          </div>

          <div className="divide-y divide-slate-200">
            {courses.length ? (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="grid gap-4 px-5 py-5 md:grid-cols-[minmax(0,1fr)_9rem]"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-950">
                      {course.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {course.completedLessons} of {course.totalLessons} lessons
                    </p>
                    <div className="mt-3 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-indigo-600"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:justify-center">
                    <span className="text-sm font-semibold text-slate-700">
                      {course.progress}% complete
                    </span>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <PlayCircle size={17} />
                      Resume
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="px-5 py-8 text-center text-sm text-slate-500">
                You are not enrolled in any courses yet.
              </p>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-950">Today</h2>
            <p className="mt-1 text-sm text-slate-500">
              Lessons you completed today.
            </p>

            <div className="mt-4 space-y-3">
              {todayActivity.length ? (
                todayActivity.map((item, index) => (
                  <Link
                    key={`${item.courseSlug}-${item.lessonSlug}-${index}`}
                    href={`/learn/${item.courseSlug}/${item.lessonSlug}`}
                    className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 transition hover:bg-slate-50"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {item.lessonTitle}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {item.courseTitle}
                      </p>
                    </div>
                    <span className="ml-auto shrink-0 text-xs text-slate-400">
                      {formatTime(item.completedAt)}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                  No lessons completed yet today. Start learning!
                </p>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white">
            <h2 className="font-semibold">Today&apos;s progress</h2>
            <p className="mt-2 text-sm text-slate-300">
              {dailyGoal > 0
                ? `You've completed ${completedToday} of your ${dailyGoal} lesson daily goal.`
                : `You've completed ${completedToday} lesson${
                    completedToday === 1 ? "" : "s"
                  } so far today.`}
            </p>
            <div className="mt-4 h-2 rounded-full bg-white/15">
              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{
                  width: `${
                    dailyGoal > 0
                      ? Math.min(
                          100,
                          Math.round((completedToday / dailyGoal) * 100)
                        )
                      : completedToday > 0
                        ? 100
                        : 0
                  }%`,
                }}
              />
            </div>
            <p className="mt-3 text-sm font-medium">
              {completedToday > 0
                ? `${completedToday} done today`
                : "No lessons yet today"}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
