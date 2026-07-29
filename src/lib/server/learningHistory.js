import { ExpressApiError, getJson } from "./express-client";

export async function getLearningHistory() {
  try {
    const result = await getJson("/users/learning-history");
    return result.data ?? null;
  } catch (error) {
    if (error instanceof ExpressApiError) {
      return null;
    }

    throw error;
  }
}
