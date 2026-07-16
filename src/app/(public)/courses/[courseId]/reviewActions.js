"use server";

import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function submitReview(courseId, rating, comment) {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/reviews/course/${courseId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify({ rating: Number(rating), comment }),
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
