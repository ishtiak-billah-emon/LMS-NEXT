import { ExpressApiError, getJson } from "./express-client";

export async function getUsers() {
  const result = await getJson("/users/total-students");

  return result.data;
}

export async function getStudent(studentId) {
  // Fetch student and enrollments in parallel
  const [studentRes, enrollmentsRes] = await Promise.all([
    getJson(`/users/${studentId}`).catch((error) => {
      if (error instanceof ExpressApiError) return null;
      throw error;
    }),
    getJson("/enrollments").catch((error) => {
      if (error instanceof ExpressApiError) return { data: [] };
      throw error;
    }),
  ]);

  if (!studentRes) return null;

  const student = studentRes.data;

  // Filter enrollments for this student
  const studentEnrollments = (enrollmentsRes.data || []).filter(
    (enrollment) => enrollment.studentId === studentId && enrollment.isActive,
  );

  // Fetch every enrolled course concurrently
  const courses = await Promise.all(
    studentEnrollments.map(async (enrollment) => {
      try {
        const json = await getJson(`/courses/${enrollment.courseSlug}`);
        return json.data.course;
      } catch (error) {
        if (error instanceof ExpressApiError) return null;
        throw error;
      }
    }),
  );

  return {
    ...student,
    enrolledCourses: courses.filter(Boolean),
  };
}
