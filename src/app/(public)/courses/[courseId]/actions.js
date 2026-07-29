"use server";

import { postJson } from "@/lib/server/express-client";

export async function createEnrollmentRequest(data) {
  const result = await postJson("/courses/create-enrollment-request", {
    body: JSON.stringify(data),
  });

  return result;
}
