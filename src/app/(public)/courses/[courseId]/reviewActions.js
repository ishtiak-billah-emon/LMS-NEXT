"use server";

import { postJson } from "@/lib/server/express-client";

export async function submitReview(courseId, rating, comment) {
  const result = await postJson(`/reviews/course/${courseId}`, {
    body: JSON.stringify({ rating: Number(rating), comment }),
  });

  return result.data;
}
