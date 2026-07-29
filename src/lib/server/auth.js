import { redirect } from "next/navigation";

import { ExpressApiError, getJson } from "./express-client";

export async function getCurrentUser() {
  try {
    const result = await getJson("/users/current-user");
    return result.data;
  } catch (error) {
    if (error instanceof ExpressApiError) {
      redirect("/login");
    }

    throw error;
  }
}

export async function getOptionalCurrentUser() {
  try {
    const result = await getJson("/users/current-user");
    return result.data;
  } catch (error) {
    if (error instanceof ExpressApiError) {
      return null;
    }

    throw error;
  }
}
