"use server";

import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function createEnrollmentRequest(data) {
  const cookieStore = await cookies();
  console.log('dataaaaaaaa', data);
  const res = await fetch(`${API}/courses/create-enrollment-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify(data),
  });

  const contentType = res.headers.get("content-type") || "";
  const result = contentType.includes("application/json")
    ? await res.json()
    : { message: await res.text() };

  if (!res.ok) {
    throw new Error(result.message || "Failed to send enrollment request.");
  }

  return result;
}
