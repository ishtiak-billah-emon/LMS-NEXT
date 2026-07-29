"use server";

import { revalidatePath } from "next/cache";
import { getJson, postJson, patchJson, deleteJson } from "@/lib/server/express-client";

export async function getEnrollments() {
  const result = await getJson("/enrollments", { cache: "no-store" });

  return result.data;
}

export async function createEnrollment(data) {
  const result = await postJson("/enrollments", {
    body: JSON.stringify(data),
  });

  revalidatePath("/dashboard/teacher/enrollments");

  return result;
}

export async function updateEnrollment(id, data) {
  const result = await patchJson(`/enrollments/${id}`, {
    body: JSON.stringify(data),
  });

  revalidatePath("/dashboard/teacher/enrollments");

  return result;
}

export async function deleteEnrollment(id) {
  const result = await deleteJson(`/enrollments/${id}`);

  revalidatePath("/dashboard/teacher/enrollments");

  return result;
}
