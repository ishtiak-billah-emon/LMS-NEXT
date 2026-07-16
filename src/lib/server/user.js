import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function getUsers() {
  const cookieStore = await cookies();

  const res = await fetch(`${API}/users/total-students`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  const result = await res.json();

  return result.data;
}

// export async function getStudent(studentId) {
//   const cookieStore = await cookies();

//   const res = await fetch(`${API}/users/${studentId}`, {
//     headers: {
//       Cookie: cookieStore.toString(),
//     },
//     cache: "no-store",
//   });

//   // A 404/invalid id returns an API error rather than `data`; returning null
//   // lets the route show Next's not-found page instead of crashing on `result`.
//   if (!res.ok) return null;

//   const result = await res.json();

//   return result.data;
// }

export async function getStudent(studentId) {
  const cookieStore = await cookies();

  const headers = {
    Cookie: cookieStore.toString(),
  };

  // Fetch student and enrollments in parallel
  const [studentRes, enrollmentsRes] = await Promise.all([
    fetch(`${API}/users/${studentId}`, {
      headers,
      cache: "no-store",
    }),

    fetch(`${API}/enrollments`, {
      headers,
      cache: "no-store",
    }),
  ]);

  if (!studentRes.ok) return null;

  const studentJson = await studentRes.json();
  const enrollmentsJson = await enrollmentsRes.json();

  const student = studentJson.data;

  // Filter enrollments for this student
  const studentEnrollments = (enrollmentsJson.data || []).filter(
    (enrollment) => enrollment.studentId === studentId && enrollment.isActive,
  );

  // Fetch every enrolled course concurrently
  const courses = await Promise.all(
    studentEnrollments.map(async (enrollment) => {
      const res = await fetch(`${API}/courses/${enrollment.courseSlug}`, {
        headers,
        cache: "no-store",
      });

      if (!res.ok) return null;

      const json = await res.json();

      return json.data.course;
    }),
  );

  return {
    ...student,
    enrolledCourses: courses.filter(Boolean),
  };
}
