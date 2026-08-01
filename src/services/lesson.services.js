import { get, ExpressApiError } from "@/lib/server/express-client";

export async function getLesson(courseSlug, lessonSlug) {
  try {
    const response = await get(`/courses/${courseSlug}/${lessonSlug}`);
    const result = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data: result.data,
      message: result.message,
    };
  } catch (error) {
    if (error instanceof ExpressApiError) {
      return {
        ok: false,
        status: error.status,
        data: null,
        message: error.message,
      };
    }

    throw error;
  }
}
