"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function createCourse(formData) {
  const cookieStore = await cookies();
  const thumbnail = formData.get("thumbnail");

  formData.set("isFeatured", formData.get("isFeatured") === "on" ? "true" : "false");

  if (!thumbnail || thumbnail.size === 0) {
    formData.delete("thumbnail");
  }

  const res = await fetch(`${API}/courses/create-course`, {
    method: "POST",
    headers: {
      // Do not set Content-Type here; fetch must add the multipart boundary for the image upload.
      Cookie: cookieStore.toString(),
    },
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create course.");
  }

  revalidatePath("/dashboard/teacher/courses");
  revalidatePath("/courses");

  return result;
}

export async function updateCourse(courseId, courseSlug, formData) {
  const cookieStore = await cookies();
  const thumbnail = formData.get("thumbnail");

  formData.set("isFeatured", formData.get("isFeatured") === "on" ? "true" : "false");

  if (!thumbnail || thumbnail.size === 0) {
    formData.delete("thumbnail");
  }

  const res = await fetch(`${API}/courses/${courseId}`, {
    method: "PATCH",
    headers: {
      // Do not set Content-Type here; fetch must add the multipart boundary for the thumbnail upload.
      Cookie: cookieStore.toString(),
    },
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update course.");
  }

  revalidatePath("/dashboard/teacher/courses");
  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);
  revalidatePath("/courses");

  return result;
}

export async function getCoursesByTeacher(teacherId) {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/courses/teacher/${teacherId}`, {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch teacher courses.");
  }

  return result.data?.courses || [];
}

export async function changeCourseStatus(courseId, courseSlug, status) {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/courses/${courseId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify({ status }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to change course status.");
  }

  revalidatePath("/dashboard/teacher/courses");
  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);
  revalidatePath("/courses");

  return result;
}

export async function createSection(courseId, courseSlug, data) {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/courses/${courseId}/create-section`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create section.");
  }

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return result;
}

export async function updateSection(courseId, sectionId, courseSlug, data) {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/courses/${courseId}/sections/${sectionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update section.");
  }

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return result;
}

export async function deleteSection(courseId, sectionId, courseSlug) {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/courses/${courseId}/sections/${sectionId}`, {
    method: "DELETE",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete section.");
  }

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return result;
}

export async function createLesson(courseId, sectionId, courseSlug, data) {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/courses/${courseId}/${sectionId}/create-lesson`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create lesson.");
  }

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return result;
}

export async function updateLesson(
  courseId,
  sectionId,
  lessonId,
  courseSlug,
  data,
) {
  const cookieStore = await cookies();

  const res = await fetch(
    `${API}/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(data),
    },
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update lesson.");
  }

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return result;
}

export async function deleteLesson(courseId, sectionId, lessonId, courseSlug) {
  const cookieStore = await cookies();

  const res = await fetch(
    `${API}/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`,
    {
      method: "DELETE",
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete lesson.");
  }

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return result;
}

export async function createResource(
  courseId,
  sectionId,
  lessonId,
  courseSlug,
  data,
) {
  const cookieStore = await cookies();

  const res = await fetch(
    `${API}/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/resources`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(data),
    },
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create resource.");
  }

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return result;
}

export async function updateResource(
  courseId,
  sectionId,
  lessonId,
  resourceId,
  courseSlug,
  data,
) {
  const cookieStore = await cookies();

  const res = await fetch(
    `${API}/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/resources/${resourceId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(data),
    },
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update resource.");
  }

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return result;
}

export async function deleteResource(
  courseId,
  sectionId,
  lessonId,
  resourceId,
  courseSlug,
) {
  const cookieStore = await cookies();

  const res = await fetch(
    `${API}/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/resources/${resourceId}`,
    {
      method: "DELETE",
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete resource.");
  }

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return result;
}
