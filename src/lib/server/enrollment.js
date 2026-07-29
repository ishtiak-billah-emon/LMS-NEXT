import { ExpressApiError, getJson } from "./express-client";

export async function getMyCourses() {
  try {
    const result = await getJson("/users/my-courses");
    return result.data;
  } catch (error) {
    if (error instanceof ExpressApiError) {
      throw new Error("Failed to fetch courses");
    }

    throw error;
  }
}

export async function getEnrollments() {
  try {
    return await getJson("/enrollments");
  } catch (error) {
    if (error instanceof ExpressApiError) {
      throw new Error("Failed to fetch enrollments");
    }

    throw error;
  }
}
