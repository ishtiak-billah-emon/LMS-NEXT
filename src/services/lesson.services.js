import { get } from "@/lib/server/express-client";

export async function getLesson(courseSlug, lessonSlug) {
  const response = await get(`/courses/${courseSlug}/${lessonSlug}`);
  const result = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data: result.data,
    message: result.message,
  };
}
