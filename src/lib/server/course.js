const API = process.env.NEXT_PUBLIC_API_URL;
import { cookies } from "next/headers";

export async function getCourses() {
  const res = await fetch(`${API}/courses`, {
    next: {
      revalidate: 300,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  const result = await res.json();

  return result.data.courses;
}

export async function getFeaturedCourses() {
  const res = await fetch(`${API}/courses/featured`, {
    next: {
      revalidate: 300,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch featured courses");
  }

  const result = await res.json();

  return result.data.courses;
}

export async function getCourse(slug) {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/courses/${slug}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const result = await res.json();

  return result.data;
}
