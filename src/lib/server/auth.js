import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/users/current-user`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/login");
  }

  const result = await res.json();

  return result.data;
}
