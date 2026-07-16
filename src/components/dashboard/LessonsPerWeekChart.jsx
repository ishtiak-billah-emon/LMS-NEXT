"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const toKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const BAR_COLORS = [
  "#c7d2fe", // indigo-200
  "#a5b4fc", // indigo-300
  "#818cf8", // indigo-400
  "#6366f1", // indigo-500
  "#4f46e5", // indigo-600
  "#4f46e5",
  "#4338ca", // indigo-700
  "#4338ca",
  "#3730a3", // indigo-800
  "#3730a3",
  "#312e81", // indigo-900
  "#312e81",
];

export default function LessonsPerWeekChart({ daily = {} }) {
  const data = useMemo(() => {
    const end = new Date();
    end.setHours(0, 0, 0, 0);

    const weeks = [];

    for (let i = 11; i >= 0; i--) {
      const weekEnd = new Date(end);
      weekEnd.setDate(end.getDate() - i * 7);

      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);

      let lessons = 0;
      const cursor = new Date(weekStart);
      while (cursor <= weekEnd) {
        lessons += daily[toKey(cursor)] || 0;
        cursor.setDate(cursor.getDate() + 1);
      }

      weeks.push({
        label: weekStart.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        lessons,
      });
    }

    return weeks;
  }, [daily]);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            interval={1}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <Tooltip
            cursor={{ fill: "rgba(99,102,241,0.08)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
            labelStyle={{ color: "#0f172a", fontWeight: 600 }}
            formatter={(value) => [
              `${value} lesson${value === 1 ? "" : "s"}`,
              "Completed",
            ]}
          />
          <Bar dataKey="lessons" radius={[6, 6, 0, 0]} maxBarSize={36}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.lessons > 0
                    ? BAR_COLORS[index % BAR_COLORS.length]
                    : "#f1f5f9"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
