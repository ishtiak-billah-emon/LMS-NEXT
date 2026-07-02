"use client";

import { useMemo, useState } from "react";
import CourseCard from "@/components/course/CourseCard";

export default function CourseFilter({ courses = [] }) {
  const [selectedClass, setSelectedClass] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const classTypes = [
    "All",
    ...new Set(courses.map((course) => course.category).filter(Boolean)),
  ];

  const filteredCourses = useMemo(() => {
    let updatedCourses = [...courses];

    if (selectedClass !== "All") {
      updatedCourses = updatedCourses.filter(
        (course) => course.category === selectedClass,
      );
    }

    switch (sortBy) {
      case "students":
        updatedCourses.sort(
          (a, b) => (b.totalStudents ?? 0) - (a.totalStudents ?? 0),
        );
        break;

      case "rating":
        updatedCourses.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;

      default:
        break;
    }

    return updatedCourses;
  }, [courses, selectedClass, sortBy]);

  return (
    <>
      {/* Filters */}
      <section className="sticky top-16 z-30 border-b border-border bg-background/80 py-6 backdrop-blur-xl">
        <div className="container mx-auto flex flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3">
            {classTypes.map((item) => (
              <button
                key={item}
                onClick={() => setSelectedClass(item)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  selectedClass === item
                    ? "bg-primary text-white"
                    : "border border-border bg-white text-text-secondary hover:border-primary hover:text-primary"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-2xl border border-border bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-primary"
          >
            <option value="latest">Latest Released</option>
            <option value="students">Most Students</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </section>

      {/* Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.slug ?? course._id ?? course.title}
                course={course}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
