import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function getLearningHistory() {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/users/learning-history`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const result = await res.json();

  return result.data ?? null;
}
