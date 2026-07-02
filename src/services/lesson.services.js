import { cookies } from "next/headers";

export async function getLesson(courseSlug, lessonSlug) {
  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseSlug}/${lessonSlug}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    },
  );

  const result = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    data: result.data,
    message: result.message,
  };
}

