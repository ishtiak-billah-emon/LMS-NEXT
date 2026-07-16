import Link from "next/link";
import { Users, GraduationCap, Wallet, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getUsers } from "@/lib/server/user";
import { getEnrollments } from "./enrollments/actions";

export default async function TeacherDashboardPage() {
  const [students, enrollments] = await Promise.all([
    getUsers(),
    getEnrollments(),
  ]);

  const totalRevenue = enrollments.reduce(
    (sum, item) => sum + (item.totalAmount || 0),
    0,
  );

  const recentEnrollments = enrollments.slice(0, 5);

  return (
    <div className="space-y-8 space-x-2 mx-2">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>

        <p className="text-muted-foreground">
          Welcome back! Here is an overview of your platform.
        </p>
      </div>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Students</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">{students.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Enrollments</CardTitle>
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">{enrollments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Revenue</CardTitle>
            <Wallet className="h-5 w-5 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">
              ৳{totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/dashboard/teacher/students">Manage Students</Link>
          </Button>

          <Button asChild variant="secondary">
            <Link href="/dashboard/teacher/enrollments">
              Manage Enrollments
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Enrollments */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Enrollments</CardTitle>

          <Button variant="ghost" asChild>
            <Link href="/dashboard/teacher/enrollments">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          {recentEnrollments.length === 0 ? (
            <p className="text-muted-foreground">No enrollments found.</p>
          ) : (
            <div className="space-y-4">
              {recentEnrollments.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div>
                    <p className="font-medium">{item.studentEmail}</p>

                    <p className="text-sm text-muted-foreground">
                      {item.courseTitle}
                    </p>
                  </div>

                  <div className="font-semibold">৳{item.totalAmount}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
