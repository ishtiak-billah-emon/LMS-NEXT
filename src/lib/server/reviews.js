import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function getCourseReviews(courseId, page = 1, limit = 10) {
  const cookieStore = await cookies();

  const res = await fetch(
    `${API}/reviews/course/${courseId}?page=${page}&limit=${limit}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return { reviews: [], pagination: { page, limit, totalReviews: 0, totalPages: 0 } };
  }

  const result = await res.json();
  return result.data;
}

export async function createReview(courseId, { rating, comment }) {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/reviews/course/${courseId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify({ rating, comment }),
  });

  const contentType = res.headers.get("content-type") || "";
  const result = contentType.includes("application/json")
    ? await res.json()
    : { message: await res.text() };

  if (!res.ok) {
    throw new Error(result.message || "Failed to submit review");
  }

  return result.data;
}

export async function deleteReview(reviewId) {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const result = contentType.includes("application/json")
    ? await res.json()
    : { message: await res.text() };

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete review");
  }

  return result.data;
}
