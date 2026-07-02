import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function getMyCourses() {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/users/my-courses`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  const result = await res.json();

  return result.data;
}
