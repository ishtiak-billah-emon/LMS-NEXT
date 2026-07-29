"use server";

import { revalidatePath } from "next/cache";
import { getJson, patchJson } from "@/lib/server/express-client";

const requestsPath = "/dashboard/teacher/enrollment-requests";

export async function getEnrollmentRequests() {
  const result = await getJson("/courses/enrollment-requests", {
    cache: "no-store",
  });

  return result.data ?? result.requests ?? [];
}

export async function updateEnrollmentRequestStatus(id, status) {
  if (!id) throw new Error("Enrollment request ID is required.");
  if (!["pending", "approved", "rejected"].includes(status)) {
    throw new Error("Invalid enrollment request status.");
  }

  const result = await patchJson(`/courses/enrollment-requests/${id}`, {
    body: JSON.stringify({ status }),
  });

  revalidatePath(requestsPath);
  return result;
}
