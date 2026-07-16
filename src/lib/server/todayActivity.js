import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function getTodayActivity() {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/users/today-activity`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const result = await res.json();

  return result.data ?? [];
}
