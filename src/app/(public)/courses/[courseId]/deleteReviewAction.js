"use server";

import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function removeReview(reviewId) {
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
