import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Flame,
  Trophy,
  BookOpen,
} from "lucide-react";
import { getLearningHistory } from "@/lib/server/learningHistory";
import LearningHeatmap from "@/components/dashboard/LearningHeatmap";
import LessonsPerWeekChart from "@/components/dashboard/LessonsPerWeekChart";

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <span
          className={`flex size-11 items-center justify-center rounded-lg ${tone}`}
        >
          <Icon size={22} />
        </span>
      </div>
    </div>
  );
}

export default async function LearningHistoryPage() {
  const history = await getLearningHistory();

  const daily = history?.daily ?? {};
  const totalLessons = history?.totalLessons ?? 0;
  const currentStreak = history?.currentStreak ?? 0;
  const longestStreak = history?.longestStreak ?? 0;
  const activeDays = history?.activeDays ?? 0;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/dashboard/student"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            Learning History
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Track your consistency, build streaks, and watch your daily learning
            habit grow over time.
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Lessons completed"
          value={totalLessons}
          tone="bg-indigo-50 text-indigo-700"
        />
        <StatCard
          icon={Flame}
          label="Current streak"
          value={`${currentStreak} day${currentStreak === 1 ? "" : "s"}`}
          tone="bg-orange-50 text-orange-600"
        />
        <StatCard
          icon={Trophy}
          label="Longest streak"
          value={`${longestStreak} day${longestStreak === 1 ? "" : "s"}`}
          tone="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={CalendarDays}
          label="Active days"
          value={activeDays}
          tone="bg-emerald-50 text-emerald-700"
        />
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">Consistency</h2>
            <p className="mt-1 text-sm text-slate-500">
              Lessons completed per day over the last year.
            </p>
          </div>
        </div>
        <LearningHeatmap daily={daily} />
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <h2 className="font-semibold text-slate-950">Lessons per week</h2>
          <p className="mt-1 text-sm text-slate-500">
            Your weekly completion trend for the last 12 weeks.
          </p>
        </div>
        <LessonsPerWeekChart daily={daily} />
      </section>
    </div>
  );
}
