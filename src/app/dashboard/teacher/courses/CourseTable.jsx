import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CourseTable({ courses = [] }) {
  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Students</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {courses.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-28 text-center text-muted-foreground"
              >
                No courses found.
              </TableCell>
            </TableRow>
          ) : (
            courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/dashboard/teacher/courses/${course.slug}`}
                    className="block"
                  >
                    {course.title}
                  </Link>
                </TableCell>

                <TableCell className="font-medium">
                  <Link
                    href={`/dashboard/teacher/courses/${course.slug}`}
                    className="block"
                  >
                    {course._id}
                  </Link>
                </TableCell>

                <TableCell>
                  <Link
                    href={`/dashboard/teacher/courses/${course.slug}`}
                    className="block"
                  >
                    {course.slug}
                  </Link>
                </TableCell>

                <TableCell>
                  <Link
                    href={`/dashboard/teacher/courses/${course.slug}`}
                    className="block capitalize"
                  >
                    {course.status}
                  </Link>
                </TableCell>

                <TableCell>
                  <Link
                    href={`/dashboard/teacher/courses/${course.slug}`}
                    className="block"
                  >
                    {course.totalStudents ?? 0}
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
