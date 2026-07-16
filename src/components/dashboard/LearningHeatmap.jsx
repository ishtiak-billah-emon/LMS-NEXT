"use client";

import { useMemo } from "react";

const LEVEL_COLORS = [
  "bg-slate-100",
  "bg-indigo-200",
  "bg-indigo-400",
  "bg-indigo-600",
  "bg-indigo-800",
];

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const toKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

function levelFor(count, max) {
  if (!count) return 0;
  if (max <= 1) return 1;
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

export default function LearningHeatmap({ daily = {} }) {
  const { weeks, monthLabels } = useMemo(() => {
    const end = new Date();
    end.setHours(0, 0, 0, 0);

    const start = new Date(end);
    start.setDate(end.getDate() - 364);

    // Align grid start to the Sunday on/before `start`.
    const gridStart = new Date(start);
    gridStart.setDate(start.getDate() - start.getDay());

    const cells = [];
    const cursor = new Date(gridStart);

    while (cursor <= end) {
      const key = toKey(cursor);
      cells.push({
        key,
        date: new Date(cursor),
        count: daily[key] || 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    // Group into weeks (columns of 7, Sun..Sat).
    const weekColumns = [];
    for (let i = 0; i < cells.length; i += 7) {
      weekColumns.push(cells.slice(i, i + 7));
    }

    // Month label above each week column (shown when the month changes).
    const labels = weekColumns.map((week, index) => {
      const first = week[0]?.date;
      if (!first) return "";
      if (index === 0) return MONTHS[first.getMonth()];
      const prev = weekColumns[index - 1]?.[0]?.date;
      return prev && prev.getMonth() !== first.getMonth()
        ? MONTHS[first.getMonth()]
        : "";
    });

    return { weeks: weekColumns, monthLabels: labels };
  }, [daily]);

  const max = useMemo(
    () => Object.values(daily).reduce((m, v) => Math.max(m, v), 0),
    [daily]
  );

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col gap-1.5">
          {/* Month labels */}
          <div className="flex gap-1 pl-9">
            {monthLabels.map((label, i) => (
              <div
                key={i}
                className="w-3 text-[10px] font-medium text-slate-400"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Weekday labels */}
            <div className="flex flex-col gap-1 pr-1">
              {WEEKDAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  className="flex h-3 items-center text-[10px] text-slate-400"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Week columns */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((cell) => (
                  <div
                    key={cell.key}
                    title={
                      cell.count > 0
                        ? `${cell.count} lesson${cell.count > 1 ? "s" : ""} on ${cell.date.toLocaleDateString(
                            undefined,
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}`
                        : `No lessons on ${cell.date.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}`
                    }
                    className={`size-3 rounded-sm ${LEVEL_COLORS[levelFor(
                      cell.count,
                      max
                    )]}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-slate-500">
        <span>Less</span>
        {LEVEL_COLORS.map((color) => (
          <span key={color} className={`size-3 rounded-sm ${color}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
