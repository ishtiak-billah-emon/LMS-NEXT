"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Flag, Target } from "lucide-react";
import { authService } from "@/services/auth.services";

export default function DailyGoalCard({
  initialGoal = 0,
  completedToday = 0,
}) {
  const router = useRouter();
  const hasGoal = Number(initialGoal) > 0;

  const [goal, setGoal] = useState(hasGoal ? String(initialGoal) : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSet = async (event) => {
    event.preventDefault();
    setError("");

    const value = Number(goal);

    if (!Number.isInteger(value) || value < 1) {
      setError("Please enter a valid number (1 or more).");
      return;
    }

    setLoading(true);

    try {
      await authService.setDailyGoal(value);
      router.refresh();
    } catch (err) {
      setError(err?.message || "Failed to set daily goal");
    } finally {
      setLoading(false);
    }
  };

  if (!hasGoal) {
    return (
      <section className="rounded-lg border border-indigo-200 bg-indigo-50 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Target size={20} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-950">
                Set your daily learning goal
              </h2>
              <p className="text-sm text-slate-600">
                How many lessons do you want to complete each day?
              </p>
            </div>
          </div>

          <form onSubmit={handleSet} className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. 3"
              className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Set goal"}
            </button>
          </form>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </section>
    );
  }

  const pct = Math.min(
    100,
    Math.round((completedToday / initialGoal) * 100)
  );
  const reached = completedToday >= initialGoal;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
            <Flag size={20} />
          </span>
          <div>
            <h2 className="font-semibold text-slate-950">Daily goal</h2>
            <p className="text-sm text-slate-600">
              {reached ? (
                <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                  <CheckCircle2 size={15} />
                  Goal reached for today!
                </span>
              ) : (
                `${completedToday} of ${initialGoal} lessons completed today`
              )}
            </p>
          </div>
        </div>
        <span
          className={`text-sm font-semibold ${
            reached ? "text-emerald-600" : "text-indigo-700"
          }`}
        >
          {pct}%
        </span>
      </div>

      <div className="mt-4 h-2 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full transition-all ${
            reached ? "bg-emerald-500" : "bg-indigo-600"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </section>
  );
}
