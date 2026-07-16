import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL;

async function getResponseContent(response) {
  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json")
    ? response.json()
    : { message: await response.text() };
}

export async function getBlogs(params = {}) {
  const cookieStore = await cookies();
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `${API}/blogs?${queryString}`
    : `${API}/blogs`;

  const response = await fetch(url, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });

  const result = await getResponseContent(response);

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch blogs.");
  }

  return result.data ?? result;
}

export async function getBlogBySlug(slug) {
  const cookieStore = await cookies();
  const response = await fetch(`${API}/blogs/slug/${slug}`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });

  const result = await getResponseContent(response);

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch blog.");
  }

  return result.data ?? result;
}

export async function getBlogById(blogId) {
  const cookieStore = await cookies();
  const response = await fetch(`${API}/blogs/${blogId}`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });

  const result = await getResponseContent(response);

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch blog.");
  }

  return result.data ?? result;
}
