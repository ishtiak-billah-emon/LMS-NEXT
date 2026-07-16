"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { markLessonComplete } from "@/lib/client/lesson";

export default function MarkCompleteButton({ courseSlug, lessonSlug, completed }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(completed);

  async function handleComplete() {
    if (isCompleted) return;

    setLoading(true);

    try {
      await markLessonComplete(courseSlug, lessonSlug);
      setIsCompleted(true);
      router.refresh();
    } catch (error) {
      alert(error.message || "Failed to mark lesson as complete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading || isCompleted}
      className={`inline-flex items-center rounded-xl px-5 py-3 text-sm font-semibold transition ${
        isCompleted
          ? "cursor-not-allowed bg-green-600 text-white"
          : loading
            ? "cursor-not-allowed bg-primary/70 text-white"
            : "bg-primary text-white hover:bg-primary-hover"
      }`}
    >
      <CheckCircle2 className="mr-2 h-4 w-4" />
      {loading ? "Saving..." : isCompleted ? "Completed" : "Mark as Complete"}
    </button>
  );
}
