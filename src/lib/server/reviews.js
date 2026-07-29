import { ExpressApiError, deleteJson, getJson, postJson } from "./express-client";

function getErrorMessage(error, fallback) {
  if (!(error instanceof ExpressApiError)) return null;

  try {
    return JSON.parse(error.body || "{}").message || fallback;
  } catch {
    return error.body || fallback;
  }
}

export async function getCourseReviews(courseId, page = 1, limit = 10) {
  try {
    const result = await getJson(`/reviews/course/${courseId}?page=${page}&limit=${limit}`);
    return result.data;
  } catch (error) {
    if (!(error instanceof ExpressApiError)) throw error;

    return { reviews: [], pagination: { page, limit, totalReviews: 0, totalPages: 0 } };
  }
}

export async function createReview(courseId, { rating, comment }) {
  try {
    const result = await postJson(`/reviews/course/${courseId}`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    return result.data;
  } catch (error) {
    const message = getErrorMessage(error, "Failed to submit review");
    if (message) throw new Error(message);

    throw error;
  }
}

export async function deleteReview(reviewId) {
  try {
    const result = await deleteJson(`/reviews/${reviewId}`);
    return result.data;
  } catch (error) {
    const message = getErrorMessage(error, "Failed to delete review");
    if (message) throw new Error(message);

    throw error;
  }
}
