import { ExpressApiError, getJson } from "./express-client";

function getErrorMessage(error, fallback) {
  if (!(error instanceof ExpressApiError)) return null;

  try {
    return JSON.parse(error.body || "{}").message || fallback;
  } catch {
    return error.body || fallback;
  }
}

export async function getBlogs(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const path = queryString ? `/blogs?${queryString}` : "/blogs";
  try {
    const result = await getJson(path);
    return result.data ?? result;
  } catch (error) {
    const message = getErrorMessage(error, "Failed to fetch blogs.");
    if (message) throw new Error(message);

    throw error;
  }
}

export async function getBlogBySlug(slug) {
  try {
    const result = await getJson(`/blogs/slug/${slug}`);
    return result.data ?? result;
  } catch (error) {
    const message = getErrorMessage(error, "Failed to fetch blog.");
    if (message) throw new Error(message);

    throw error;
  }
}

export async function getBlogById(blogId) {
  try {
    const result = await getJson(`/blogs/${blogId}`);
    return result.data ?? result;
  } catch (error) {
    const message = getErrorMessage(error, "Failed to fetch blog.");
    if (message) throw new Error(message);

    throw error;
  }
}
