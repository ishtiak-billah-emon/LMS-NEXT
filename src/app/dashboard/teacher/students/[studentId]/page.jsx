import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudent } from "@/lib/server/user";

export default async function StudentDetailsPage({ params }) {
  const { studentId } = await params;

  const student = await getStudent(studentId);

  if (!student) notFound();

  const socialLinks = student.socialLinks ?? {};
  const enrolledCourses = (student.enrolledCourses ?? []).filter(Boolean);
console.log('check bug:',enrolledCourses);
  return (
    <main className="mx-auto max-w-7xl space-y-8 p-8">
      {/* Profile */}
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <div className="flex items-center gap-6">
          <img
            src={
              student.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                student.fullName,
              )}`
            }
            alt={student.fullName}
            className="h-28 w-28 rounded-full border object-cover"
          />

          <div>
            <h1 className="text-3xl font-bold">{student.fullName}</h1>

            <p className="text-muted-foreground">@{student.userName}</p>

            <p className="text-muted-foreground">ID: {student._id}</p>

            <div className="mt-4 flex gap-3">
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                {student.status}
              </span>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {student.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="mb-6 text-xl font-semibold">Personal Information</h2>

        <div className="grid grid-cols-2 gap-6">
          <Info title="Full Name" value={student.fullName} />
          <Info title="Username" value={student.userName} />
          <Info title="Email" value={student.email} />
          <Info title="Phone" value={student.phone || "-"} />
          <Info title="Institution" value={student.institutionName || "-"} />
          <Info title="Class" value={student.class || "-"} />
          <Info title="Location" value={student.location || "-"} />
          <Info title="Verified" value={student.isVerified ? "Yes" : "No"} />
        </div>
      </div>

      {/* Bio */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Bio</h2>

        <p className="text-muted-foreground">
          {student.bio || "No bio added."}
        </p>
      </div>

      {/* Social Links */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="mb-6 text-xl font-semibold">Social Links</h2>

        <div className="grid grid-cols-2 gap-4">
          <Social title="Facebook" link={socialLinks.facebook} />
          <Social title="Github" link={socialLinks.github} />
          <Social title="LinkedIn" link={socialLinks.linkedin} />
          <Social title="Twitter" link={socialLinks.twitter} />
          <Social title="Website" link={socialLinks.website} />
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Enrolled Courses ({enrolledCourses.length})
        </h2>

        {enrolledCourses.length === 0 ? (
          <p className="text-muted-foreground">
            Student is not enrolled in any course.
          </p>
        ) : (
          <div className="space-y-3">
            {enrolledCourses.map((course) => (
              <div
                key={course._id}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <p className="font-semibold">{course.title}</p>

                  <p className="text-sm text-muted-foreground">
                    Teacher: {course.teacher?.fullName || "Unknown"}
                  </p>

                  {course.category && (
                    <p className="text-sm text-muted-foreground">
                      Category: {course.category}
                    </p>
                  )}
                </div>

                <Link
                  href={`/courses/${course.slug}`}
                  className="font-medium text-primary hover:underline"
                >
                  View Course →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Info({ title, value }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-1 font-medium">{value || "-"}</p>
    </div>
  );
}

function Social({ title, link }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>

      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {link}
        </a>
      ) : (
        <p>-</p>
      )}
    </div>
  );
}
