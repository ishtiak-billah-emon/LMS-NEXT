"use server";

import { revalidatePath } from "next/cache";
import { post, patch, get, del } from "@/lib/server/express-client";

export async function createCourse(formData) {
  formData.set("isFeatured", formData.get("isFeatured") === "on" ? "true" : "false");

  const thumbnail = formData.get("thumbnail");
  if (!thumbnail || thumbnail.size === 0) {
    formData.delete("thumbnail");
  }

  const res = await post("/courses/create-course", {
    body: formData,
  });
  const result = await res.json();

  revalidatePath("/dashboard/teacher/courses");
  revalidatePath("/courses");

  return result;
}

export async function updateCourse(courseId, courseSlug, formData) {
  formData.set("isFeatured", formData.get("isFeatured") === "on" ? "true" : "false");

  const thumbnail = formData.get("thumbnail");
  if (!thumbnail || thumbnail.size === 0) {
    formData.delete("thumbnail");
  }

  const res = await patch(`/courses/${courseId}`, {
    body: formData,
  });
  const result = await res.json();

  revalidatePath("/dashboard/teacher/courses");
  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);
  revalidatePath("/courses");

  return result;
}

export async function getCoursesByTeacher(teacherId) {
  const result = await get(`/courses/teacher/${teacherId}`, {
    cache: "no-store",
  });
  const json = await result.json();

  return json.data?.courses || [];
}

export async function changeCourseStatus(courseId, courseSlug, status) {
  const result = await patch(`/courses/${courseId}/status`, {
    body: JSON.stringify({ status }),
  });
  const json = await result.json();

  revalidatePath("/dashboard/teacher/courses");
  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);
  revalidatePath("/courses");

  return json;
}

export async function createSection(courseId, courseSlug, data) {
  const result = await post(`/courses/${courseId}/create-section`, {
    body: JSON.stringify(data),
  });
  const json = await result.json();

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return json;
}

export async function updateSection(courseId, sectionId, courseSlug, data) {
  const result = await patch(`/courses/${courseId}/sections/${sectionId}`, {
    body: JSON.stringify(data),
  });
  const json = await result.json();

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return json;
}

export async function deleteSection(courseId, sectionId, courseSlug) {
  const result = await del(`/courses/${courseId}/sections/${sectionId}`);
  const json = await result.json();

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return json;
}

export async function createLesson(courseId, sectionId, courseSlug, data) {
  const result = await post(`/courses/${courseId}/${sectionId}/create-lesson`, {
    body: JSON.stringify(data),
  });
  const json = await result.json();

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return json;
}

export async function updateLesson(
  courseId,
  sectionId,
  lessonId,
  courseSlug,
  data,
) {
  const result = await patch(
    `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`,
    {
      body: JSON.stringify(data),
    },
  );
  const json = await result.json();

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return json;
}

export async function deleteLesson(courseId, sectionId, lessonId, courseSlug) {
  const result = await del(
    `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`,
  );
  const json = await result.json();

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return json;
}

export async function createResource(
  courseId,
  sectionId,
  lessonId,
  courseSlug,
  data,
) {
  const result = await post(
    `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/resources`,
    {
      body: JSON.stringify(data),
    },
  );
  const json = await result.json();

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return json;
}

export async function updateResource(
  courseId,
  sectionId,
  lessonId,
  resourceId,
  courseSlug,
  data,
) {
  const result = await patch(
    `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/resources/${resourceId}`,
    {
      body: JSON.stringify(data),
    },
  );
  const json = await result.json();

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return json;
}

export async function deleteResource(
  courseId,
  sectionId,
  lessonId,
  resourceId,
  courseSlug,
) {
  const result = await del(
    `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/resources/${resourceId}`,
  );
  const json = await result.json();

  revalidatePath(`/dashboard/teacher/courses/${courseSlug}`);

  return json;
}
