

const API = "/api";

export async function markLessonComplete(courseSlug, lessonSlug) {
  const res = await fetch(`${API}/courses/${courseSlug}/${lessonSlug}/complete`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(result.message || "Failed to mark lesson as complete");
  }

  return result;
}
