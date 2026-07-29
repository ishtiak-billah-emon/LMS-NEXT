"use server";

import { deleteJson } from "@/lib/server/express-client";

export async function removeReview(reviewId) {
  const result = await deleteJson(`/reviews/${reviewId}`);

  return result.data;
}
