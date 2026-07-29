import { ExpressApiError, getJson } from "./express-client";

export async function getTodayActivity() {
  try {
    const result = await getJson("/users/today-activity");
    return result.data ?? [];
  } catch (error) {
    if (error instanceof ExpressApiError) {
      return [];
    }

    throw error;
  }
}
