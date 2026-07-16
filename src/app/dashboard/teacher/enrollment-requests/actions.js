"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL;
const requestsPath = "/dashboard/teacher/enrollment-requests";

async function getResponseContent(response) {
  const contentType = response.headers.get("content-type") || "";

  return contentType.includes("application/json")
    ? response.json()
    : { message: await response.text() };
}

export async function getEnrollmentRequests() {
  const cookieStore = await cookies();
  const response = await fetch(`${API}/courses/enrollment-requests`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });
  const result = await getResponseContent(response);

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch enrollment requests.");
  }

  return result.data ?? result.requests ?? [];
}

export async function updateEnrollmentRequestStatus(id, status) {
  if (!id) throw new Error("Enrollment request ID is required.");
  if (!["pending", "approved", "rejected"].includes(status)) {
    throw new Error("Invalid enrollment request status.");
  }

  const cookieStore = await cookies();
  const response = await fetch(`${API}/courses/enrollment-requests/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify({ status }),
  });
  const result = await getResponseContent(response);

  if (!response.ok) {
    throw new Error(result.message || "Failed to update enrollment request.");
  }

  revalidatePath(requestsPath);
  return result;
}
