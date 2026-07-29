import { ExpressApiError, getJson } from "./express-client";

export async function getCourses() {
  try {
    const result = await getJson("/courses", {
      cache: "force-cache",
      next: {
        revalidate: 300,
      },
    });

    return result.data.courses;
  } catch (error) {
    if (error instanceof ExpressApiError) {
      throw new Error("Failed to fetch courses");
    }

    throw error;
  }
}

export async function getFeaturedCourses() {
  try {
    const result = await getJson("/courses/featured", {
      cache: "force-cache",
      next: {
        revalidate: 300,
      },
    });

    return result.data.courses;
  } catch (error) {
    if (error instanceof ExpressApiError) {
      throw new Error("Failed to fetch featured courses");
    }

    throw error;
  }
}

export async function getCourse(slug) {
  try {
    const result = await getJson(`/courses/${slug}`);
    return result.data;
  } catch (error) {
    if (error instanceof ExpressApiError) {
      return null;
    }

    throw error;
  }
}
