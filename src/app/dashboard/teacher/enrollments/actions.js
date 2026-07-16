"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function getEnrollments() {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/enrollments`, {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  console.log("STATUS:", res.status);

  const result = await res.json();

  console.log("RESULT:", result);

  if (!res.ok) {
    throw new Error("Failed to fetch enrollments");
  }

  return result.data;
}
// ============================
// Create Enrollment
// ============================

export async function createEnrollment(data) {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/enrollments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create enrollment.");
  }

  revalidatePath("/dashboard/teacher/enrollments");

  return result;
}
// ============================
// Update Enrollment
// ============================

export async function updateEnrollment(id, data) {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/enrollments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update enrollment.");
  }

  revalidatePath("/dashboard/teacher/enrollments");

  return result;
}

// ============================
// Delete Enrollment
// ============================

export async function deleteEnrollment(id) {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/enrollments/${id}`, {
    method: "DELETE",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete enrollment.");
  }

  revalidatePath("/dashboard/teacher/enrollments");

  return result;
}
