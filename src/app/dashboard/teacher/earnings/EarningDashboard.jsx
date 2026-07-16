"use client";

import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Wallet, DollarSign, Calendar, CalendarDays } from "lucide-react";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  Tooltip,
} from "recharts";

import {
  format,
  isToday,
  isYesterday,
  subDays,
  isAfter,
  startOfDay,
} from "date-fns";

export default function EarningsDashboard({ enrollments }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const total = enrollments.reduce((sum, item) => sum + item.totalAmount, 0);

  const today = enrollments
    .filter((e) => isToday(new Date(e.createdAt)))
    .reduce((a, b) => a + b.totalAmount, 0);

  const yesterday = enrollments
    .filter((e) => isYesterday(new Date(e.createdAt)))
    .reduce((a, b) => a + b.totalAmount, 0);

  const last7 = enrollments
    .filter((e) =>
      isAfter(new Date(e.createdAt), startOfDay(subDays(new Date(), 7))),
    )
    .reduce((a, b) => a + b.totalAmount, 0);

  const last30 = enrollments
    .filter((e) =>
      isAfter(new Date(e.createdAt), startOfDay(subDays(new Date(), 30))),
    )
    .reduce((a, b) => a + b.totalAmount, 0);

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((item) => {
      const date = new Date(item.createdAt);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        if (date < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (date > end) return false;
      }

      return true;
    });
  }, [enrollments, startDate, endDate]);

  const chartData = useMemo(() => {
    const map = {};

    filteredEnrollments.forEach((item) => {
      const day = format(new Date(item.createdAt), "dd MMM");

      map[day] = (map[day] || 0) + item.totalAmount;
    });

    return Object.entries(map).map(([date, amount]) => ({
      date,
      amount,
    }));
  }, [filteredEnrollments]);

  return (
    <div className="space-y-8 mx-2 md:mx-4 mx-auto my-2 md:my-8">
      <div>
        <h1 className="text-3xl font-bold">Earnings Dashboard</h1>

        <p className="text-muted-foreground">
          Revenue overview of all enrollments
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Earnings"
          value={total}
          icon={<Wallet className="h-5 w-5" />}
          color="from-violet-500 to-purple-600"
        />

        <StatCard
          title="Today's"
          value={today}
          icon={<DollarSign className="h-5 w-5" />}
          color="from-green-500 to-emerald-600"
        />

        <StatCard
          title="Yesterday"
          value={yesterday}
          icon={<Calendar className="h-5 w-5" />}
          color="from-blue-500 to-cyan-600"
        />

        <StatCard
          title="Last 7 Days"
          value={last7}
          icon={<CalendarDays className="h-5 w-5" />}
          color="from-orange-500 to-red-500"
        />

        <StatCard
          title="Last 30 Days"
          value={last30}
          icon={<CalendarDays className="h-5 w-5" />}
          color="from-pink-500 to-fuchsia-600"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle>Revenue Chart</CardTitle>

          <div className="flex flex-wrap gap-4">
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Start Date</p>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <p className="mb-1 text-xs text-muted-foreground">End Date</p>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-md border px-3 py-2"
              />
            </div>

            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="self-end rounded-md bg-primary px-4 py-2 text-sm text-white"
            >
              Reset
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <Tooltip />

              <Bar dataKey="amount" fill="#6366F1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Recent Transactions */}

      <Card>
        <CardHeader>
          <CardTitle>Recent Enrollments</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Student</th>

                  <th className="px-4 py-3 text-left font-semibold">Course</th>

                  <th className="px-4 py-3 text-left font-semibold">Amount</th>

                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                </tr>
              </thead>

              <tbody>
                {enrollments
                  .slice()
                  .reverse()
                  .slice(0, 10)
                  .map((item) => (
                    <tr
                      key={item._id}
                      className="border-b transition-colors hover:bg-muted/40"
                    >
                      <td className="px-4 py-4">{item.studentEmail}</td>

                      <td className="px-4 py-4">{item.courseTitle}</td>

                      <td className="px-4 py-4 font-semibold text-green-600">
                        ৳{item.totalAmount.toLocaleString()}
                      </td>

                      <td className="px-4 py-4">
                        {format(new Date(item.createdAt), "dd MMM yyyy")}
                      </td>
                    </tr>
                  ))}

                {enrollments.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-muted-foreground"
                    >
                      No enrollments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Card className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`bg-gradient-to-r ${color} flex items-center justify-between p-4 text-white`}
      >
        <span className="text-sm font-medium">{title}</span>

        {icon}
      </div>

      <CardContent className="pt-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Revenue
        </p>

        <h2 className="mt-2 text-3xl font-bold">৳{value.toLocaleString()}</h2>
      </CardContent>
    </Card>
  );
}
